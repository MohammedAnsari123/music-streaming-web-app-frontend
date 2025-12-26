import React from 'react';
import { Play, Pause, StepBack, StepForward } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const PlayerControls = () => {
    const { isPlaying, togglePlayPause } = useAudioPlayer();

    return (
        <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition cursor-pointer">
                <StepBack size={20} />
            </button>
            <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition cursor-pointer"
            >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
            </button>
            <button className="text-gray-400 hover:text-white transition cursor-pointer">
                <StepForward size={20} />
            </button>
        </div>
    );
};

export default PlayerControls;
