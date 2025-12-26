import React, { useRef, useEffect } from 'react'
import { StepBack, StepForward, Pause, Play } from 'lucide-react'

const Player = ({ currentSong, isPlaying, setIsPlaying, onNext, onPrev }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center border-t border-gray-700">
            <div className="flex items-center gap-4 w-1/3">
                <img src={currentSong.image_url} className='w-12 h-12 rounded object-cover' alt="cover" />
                <div className="">
                    <h4 className="text-sm font-bold">{currentSong.title}</h4>
                    <p className="text-xs text-gray-400">{currentSong.artist}</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-1/3">
                <div className="flex gap-4 mb-2">
                    <button onClick={onPrev} className='hover:text-green-500 cursor-pointer' ><StepBack /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className='bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105' >{isPlaying ? <Pause /> : <Play />}</button>
                    <button onClick={onNext} className='hover:text-green-500 cursor-pointer' ><StepForward /></button>
                </div>
            </div>
            <audio ref={audioRef} src={currentSong.song_url} onEnded={onNext}></audio>
            <div className="w-1/3"></div>
        </div>
    )
}

export default Player
