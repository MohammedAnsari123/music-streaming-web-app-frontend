import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [history, setHistory] = useState({});

    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('https://music-streaming-web-app-backend.onrender.com/api/recently-played', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    const historyMap = {};
                    data.forEach(item => {
                        const key = item.track_id || item.episode_id;
                        historyMap[key] = item.last_position;
                    });
                    setHistory(historyMap);
                }
            } catch (err) {
                console.error("Failed to load playback history", err);
            }
        };
        fetchHistory();
    }, []);

    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const playTrack = async (track, newQueue = null) => {
        let trackToPlay = track;

        // Update Queue if provided
        if (newQueue) {
            setQueue(newQueue);
            const idx = newQueue.findIndex(t => t.id === track.id);
            setCurrentIndex(idx);
        } else {
            // Logic: If track is in current queue, just update index. Else, reset queue.
            // But for now, simple fallback: if not in queue, make it a single track queue
            // Check if track exists in current queue (shallow check of ID)
            const existingIdx = queue.findIndex(t => t.id === track.id);
            if (existingIdx !== -1) {
                setCurrentIndex(existingIdx);
            } else {
                setQueue([track]);
                setCurrentIndex(0);
            }
        }

        const FALLBACK_AUDIO = '/fallback_audio.mp3';

        if (track.source === 'spotify') {
            try {
                console.log("Resolving Spotify track via Audius...", track.title);

                const res = await fetch('https://music-streaming-web-app-backend.onrender.com/api/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: track.title, artist: track.artist })
                });

                if (!res.ok) {
                    throw new Error("Playback resolution failed");
                }

                const data = await res.json();

                if (data.error === "NOT_FOUND") {
                    console.log("Track not found, using fallback.");
                    trackToPlay = { ...track, audio_url: FALLBACK_AUDIO };
                } else {
                    console.log("Resolved:", data);
                    trackToPlay = {
                        ...track,
                        audio_url: data.audio_url,
                        duration: data.duration,
                        source: 'audius'
                    };
                }
            } catch (err) {
                console.error("Resolution flow error, using fallback:", err);
                trackToPlay = { ...track, audio_url: FALLBACK_AUDIO };
            }
        }

        if (track.source === 'internet_archive') {
            try {
                console.log("Resolving Internet Archive track...", track.title);
                const res = await fetch('https://music-streaming-web-app-backend.onrender.com/api/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: track.id,
                        source: 'internet_archive',
                        title: track.title,
                        artist: track.artist
                    })
                });

                if (!res.ok) throw new Error("IA Resolution failed");
                const data = await res.json();

                if (!data.audio_url) {
                    console.log("IA audio not found, using fallback.");
                    trackToPlay = { ...track, audio_url: FALLBACK_AUDIO };
                } else {
                    trackToPlay = {
                        ...track,
                        audio_url: data.audio_url,
                        duration: data.duration,
                        source: 'internet_archive'
                    };
                }

            } catch (err) {
                console.error("IA Resolution Error, using fallback:", err);
                trackToPlay = { ...track, audio_url: FALLBACK_AUDIO };
            }
        }

        if (!trackToPlay.audio_url) {
            console.log("No audio URL found, using fallback.");
            trackToPlay = { ...track, audio_url: FALLBACK_AUDIO };
        }

        if (currentTrack?.id === trackToPlay.id) {
            togglePlayPause();
            return;
        }

        setCurrentTrack(trackToPlay);

        const resumePos = history[trackToPlay.id];
        if (resumePos && resumePos > 5) {
            console.log(`Resuming ${trackToPlay.title} at ${resumePos}s`);
            setPendingSeek(resumePos);
        } else {
            setPendingSeek(null);
        }

        setIsPlaying(true);
    };

    const playNext = () => {
        if (queue.length === 0 || currentIndex === -1) return;
        if (currentIndex < queue.length - 1) {
            playTrack(queue[currentIndex + 1]);
        } else if (repeatMode === 'queue') {
            playTrack(queue[0]);
        }
    };

    const playPrevious = () => {
        if (queue.length === 0 || currentIndex === -1) return;

        // If current time > 3s, restart track
        if (currentTime > 3) {
            seek(0);
            return;
        }

        if (currentIndex > 0) {
            playTrack(queue[currentIndex - 1]);
        }
    };

    const [pendingSeek, setPendingSeek] = useState(null);

    const togglePlayPause = () => {
        if (!currentTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
            saveProgress(currentTrack, audioRef.current.currentTime);
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            saveProgress(currentTrack, time);
        }
    };

    const saveProgress = async (track, time) => {
        if (!track || time < 5) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        setHistory(prev => ({ ...prev, [track.id]: time }));

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const type = track.audio_url ? (track.audio_url.includes('episodes') ? 'podcast' : 'music') : 'music';
                const guessType = track.podcast_id ? 'podcast' : 'music';

                await fetch('https://music-streaming-web-app-backend.onrender.com/api/recently-played', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: track.id,
                        type: guessType,
                        position: time
                    })
                });
            } catch (err) {
                console.error("Save progress failed", err);
            }
        }, 2000);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);

            if (Math.floor(time) % 10 === 0 && Math.floor(time) > 0) {
                saveProgress(currentTrack, time);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            if (pendingSeek) {
                audioRef.current.currentTime = pendingSeek;
                setCurrentTime(pendingSeek);
                setPendingSeek(null);
            }
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name === 'AbortError') {
                            console.log("Playback interrupted (AbortError)");
                        } else {
                            console.error("Playback failed:", error);
                            setIsPlaying(false);
                        }
                    });
                }
            }
        }
    };

    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'track', 'queue'

    const toggleRepeat = () => {
        setRepeatMode(prev => {
            if (prev === 'off') return 'queue';
            if (prev === 'queue') return 'track';
            return 'off';
        });
    };

    const handleEnded = () => {
        if (repeatMode === 'track' && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
        }

        // Auto-play next if available
        if (queue.length > 0) {
            if (currentIndex < queue.length - 1) {
                playNext();
            } else if (repeatMode === 'queue') {
                playTrack(queue[0]); // Loop back to start
            } else {
                setIsPlaying(false);
                saveProgress(currentTrack, 0);
                setHistory(prev => ({ ...prev, [currentTrack.id]: 0 }));
            }
        } else {
            setIsPlaying(false);
            saveProgress(currentTrack, 0);
            setHistory(prev => ({ ...prev, [currentTrack.id]: 0 }));
        }
    };

    const handleVolumeChange = (newVolume) => {
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const value = {
        audioRef,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        repeatMode,
        playTrack,
        playNext,
        playPrevious,
        togglePlayPause,
        seek,
        setVolume: handleVolumeChange,
        toggleRepeat,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
};
