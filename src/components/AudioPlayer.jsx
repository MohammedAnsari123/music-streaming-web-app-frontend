import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import { Volume2, VolumeX, ListMusic } from 'lucide-react';
import QueueSidebar from './QueueSidebar';

const AudioPlayer = () => {
    const [showQueue, setShowQueue] = useState(false);
    const {
        audioRef,
        currentTrack,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,
        volume,
        setVolume
    } = useAudioPlayer();

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] p-4 px-6 flex flex-col md:flex-row items-center justify-between z-50 text-white h-auto md:h-24">

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

            <div className="flex flex-col items-center gap-2 w-full md:w-1/3 mt-2 md:mt-0">
                <PlayerControls />
                <ProgressBar />
            </div>

            <div className="flex w-full md:w-1/3 justify-center md:justify-end items-center gap-4 md:gap-2 pr-0 md:pr-4 mt-4 md:mt-0">
                <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={`transition-colors ${showQueue ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                    title="Queue"
                >
                    <ListMusic size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-gray-400 hover:text-white">
                        {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentTrack.audio_url || currentTrack.song_url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onError={(e) => {
                    console.error("Audio Error:", e.nativeEvent);

                }}
            />
            {showQueue && <QueueSidebar onClose={() => setShowQueue(false)} />}
        </div>
    );
};

export default AudioPlayer;
