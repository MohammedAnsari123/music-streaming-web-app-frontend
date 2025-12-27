import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

const AudioPlayer = () => {
    const {
        audioRef,
        currentTrack,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded
    } = useAudioPlayer();

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] p-4 px-6 flex flex-col md:flex-row items-center justify-between z-50 text-white h-auto md:h-24">

            {/* Track Info */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
                <img
                    src={currentTrack.image_url || "/default-cover.png"}
                    alt={currentTrack.title}
                    className="w-14 h-14 rounded object-cover shadow-md"
                />
                <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer">{currentTrack.title}</h4>
                    <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Controls & Progress */}
            <div className="flex flex-col items-center gap-2 w-full md:w-1/3 mt-2 md:mt-0">
                <PlayerControls />
                <ProgressBar />
            </div>

            {/* Volume / Extra (Placeholder for now) */}
            <div className="hidden md:flex w-1/3 justify-end">
                {/* Volume control will go here */}
            </div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack.audio_url || currentTrack.song_url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onError={(e) => {
                    console.error("Audio Error:", e.nativeEvent);
                    // Optional: setIsPlaying(false) via context if needed, but context handles state
                }}
            />
        </div>
    );
};

export default AudioPlayer;
