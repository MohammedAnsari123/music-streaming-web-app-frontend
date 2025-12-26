import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const ProgressBar = () => {
    const { currentTime, duration, seek } = useAudioPlayer();

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        seek(time);
    };

    return (
        <div className="flex items-center gap-2 w-full max-w-lg text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
            />
            <span>{formatTime(duration)}</span>
        </div>
    );
};

export default ProgressBar;
