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
    const [history, setHistory] = useState({}); // Map: trackId -> position

    const saveTimeoutRef = useRef(null);

    // Load History on Mount
    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('http://localhost:3000/api/recently-played', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Create lookup map
                    const historyMap = {};
                    data.forEach(item => {
                        // Key can be track_id (string/num) or episode_id
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

    const playTrack = async (track) => {
        let trackToPlay = track;

        // BRIDGE: Spotify -> Audius Resolution
        if (track.source === 'spotify') {
            try {
                console.log("Resolving Spotify track via Audius...", track.title);
                // Optional: Set loading state here if UI supports it

                const res = await fetch('http://localhost:3000/api/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: track.title, artist: track.artist })
                });

                if (!res.ok) {
                    throw new Error("Playback resolution failed");
                }

                const data = await res.json();

                if (data.error === "NOT_FOUND") {
                    console.log("Track not found on Audius network.");
                    alert("This track is not available for free playback.");
                    return; // Stop execution
                }

                console.log("Resolved:", data);

                // Merge Spotify metadata with Audius Audio
                trackToPlay = {
                    ...track,
                    audio_url: data.audio_url,
                    duration: data.duration, // Update duration if Audius knows better
                    source: 'audius' // Switch source context for playback? Or keep 'spotify' but with url? 
                    // User said "Audius playback only". 
                    // Let's keep metadata but use resolved URL.
                };
            } catch (err) {
                console.error("Resolution flow error:", err);
                return;
            }
        }

        // BRIDGE: Internet Archive Resolution
        if (track.source === 'internet_archive') {
            try {
                console.log("Resolving Internet Archive track...", track.title);
                const res = await fetch('http://localhost:3000/api/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: track.id,
                        source: 'internet_archive',
                        title: track.title, // Pass for logging/fallback
                        artist: track.artist
                    })
                });

                if (!res.ok) throw new Error("IA Resolution failed");
                const data = await res.json();

                if (!data.audio_url) {
                    alert("Audio file not found for this item.");
                    return;
                }

                trackToPlay = {
                    ...track,
                    audio_url: data.audio_url,
                    duration: data.duration,
                    source: 'internet_archive'
                };

            } catch (err) {
                console.error("IA Resolution Error:", err);
                return;
            }
        }

        if (currentTrack?.id === trackToPlay.id) {
            togglePlayPause();
            return;
        }

        // New track
        setCurrentTrack(trackToPlay); // Start fresh

        // CHECK RESUME
        const resumePos = history[trackToPlay.id];
        if (resumePos && resumePos > 5) {
            console.log(`Resuming ${trackToPlay.title} at ${resumePos}s`);
            setPendingSeek(resumePos);
        } else {
            setPendingSeek(null);
        }

        setIsPlaying(true);
    };

    const [pendingSeek, setPendingSeek] = useState(null);

    const togglePlayPause = () => {
        if (!currentTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
            saveProgress(currentTrack, audioRef.current.currentTime); // Save on pause
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            saveProgress(currentTrack, time); // Save on seek
        }
    };

    const saveProgress = async (track, time) => {
        if (!track || time < 5) return; // Don't save very short starts

        const token = localStorage.getItem('token');
        if (!token) return;

        // Optimistic Update
        setHistory(prev => ({ ...prev, [track.id]: time }));

        // Debounce/Throttle at API level or Component level?
        // Let's implement basic throttle here using refs or just fire-and-forget for now
        // But prompt demanded "Throttle it".

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const type = track.audio_url ? (track.audio_url.includes('episodes') ? 'podcast' : 'music') : 'music';
                // Detection is tricky if we don't store Type in Track object.
                // Assuming 'music' implies songs table.
                // Better: check if track object has 'artist' (Song) vs 'publisher' (Podcast)? 
                // Let's assume Track object has a 'type' property if it's from our Normalize function, or we guess.

                // FIX: Let's pass 'category' or 'type' in track object when playing.
                // Fallback: If it has 'artist', it's music. If 'podcast_id', it's podcast.
                const guessType = track.podcast_id ? 'podcast' : 'music';

                await fetch('http://localhost:3000/api/recently-played', {
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
        }, 2000); // 2 second debounce
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);

            // Auto save every 10 seconds approx? 
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
                setPendingSeek(null); // Clear
            }
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name === 'AbortError') {
                            // Expected if user pauses/switches quickly
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

    const handleEnded = () => {
        setIsPlaying(false);
        saveProgress(currentTrack, 0); // Reset or Keep? Usually keep "finished" state or reset. Prompt said "Do not auto-resume after track finished". So maybe reset history to 0?
        // Let's reset history for this track so next play starts at 0.
        setHistory(prev => ({ ...prev, [currentTrack.id]: 0 }));
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
        playTrack,
        togglePlayPause,
        seek,
        setVolume: handleVolumeChange,
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
