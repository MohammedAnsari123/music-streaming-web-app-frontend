import React from 'react';
import { Play, Pause, StepBack, StepForward, Repeat, Repeat1 } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const PlayerControls = () => {
    const { isPlaying, togglePlayPause, playNext, playPrevious, repeatMode, toggleRepeat } = useAudioPlayer();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={toggleRepeat}
                className={`transition-colors ${repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                title={`Repeat: ${repeatMode}`}
            >
                {repeatMode === 'track' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>

            <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
                <StepBack size={20} />
            </button>
            <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition cursor-pointer active:scale-95"
            >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
            </button>
            <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
                <StepForward size={20} />
            </button>
        </div>
    );
};

export default PlayerControls;
