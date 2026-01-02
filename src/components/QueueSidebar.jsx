import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { X, Music } from 'lucide-react';

const QueueSidebar = ({ onClose }) => {
    const { queue, currentTrack, playTrack } = useAudioPlayer();

    if (!queue || queue.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full md:bottom-24 md:right-0 md:w-80 h-[80vh] md:h-[calc(100vh-6rem)] bg-[#121212] border-t md:border-t-0 md:border-l border-[#282828] shadow-2xl z-[60] md:z-40 rounded-t-2xl md:rounded-none overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#282828] flex items-center justify-between">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <Music size={20} className="text-green-500" />
                    Play Queue
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-2 mt-2">Now Playing</h3>
                {currentTrack && (
                    <div className="bg-[#282828] p-3 rounded-md mb-4 flex items-center gap-3 border-l-4 border-green-500">
                        <img
                            src={currentTrack.image_url || "/default-cover.png"}
                            alt={currentTrack.title}
                            className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-green-500 font-medium truncate text-sm">{currentTrack.title}</h4>
                            <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
                        </div>
                        <div className="w-4 h-4 flex items-end gap-0.5">
                            <div className="w-1 bg-green-500 h-2 animate-bounce"></div>
                            <div className="w-1 bg-green-500 h-3 animate-bounce delay-75"></div>
                            <div className="w-1 bg-green-500 h-4 animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}

                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-2">Next Up</h3>
                <div className="flex flex-col gap-1">
                    {queue.map((track, index) => {
                        const isCurrent = currentTrack?.id === track.id;
                        if (isCurrent) return null; // Already shown in "Now Playing"

                        return (
                            <div
                                key={`${track.id}-${index}`}
                                onClick={() => playTrack(track, queue)}
                                className="p-2 rounded-md hover:bg-[#282828] flex items-center gap-3 cursor-pointer group transition-colors"
                            >
                                <img
                                    src={track.image_url || "/default-cover.png"}
                                    alt={track.title}
                                    className="w-10 h-10 rounded object-cover opacity-70 group-hover:opacity-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-gray-200 font-medium truncate text-sm group-hover:text-white transition-colors">
                                        {track.title}
                                    </h4>
                                    <p className="text-gray-500 text-xs truncate group-hover:text-gray-400 transition-colors">
                                        {track.artist}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {queue.length === 1 && <p className="text-gray-500 text-center py-4 text-sm">Add more tracks to build your queue.</p>}
                </div>
            </div>
        </div>
    );
};

export default QueueSidebar;
