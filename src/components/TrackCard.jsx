import React, { useState } from 'react';
import { Play, Pause, Plus } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import AddToPlaylistModal from './AddToPlaylistModal';

const TrackCard = ({ track }) => {
    const { currentTrack, isPlaying, togglePlayPause, playTrack } = useAudioPlayer();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Safety check
    if (!track) return null;

    const isCurrentTrack = currentTrack?.id === track.id;
    const isCurrentPlaying = isCurrentTrack && isPlaying;

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(track);
        }
    };

    return (
        <>
            <div
                className={`bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors group cursor-pointer relative ${isCurrentTrack ? 'bg-[#282828]' : ''
                    }`}
                onClick={() => playTrack(track)}
            >
                <div className="relative mb-4">
                    <img
                        src={track.image_url || "/default-cover.png"}
                        alt={track.title}
                        className="w-full aspect-square object-cover rounded-md shadow-lg"
                    />

                    {/* Play/Pause Button Overlay */}
                    <button
                        onClick={handlePlayClick}
                        className={`absolute bottom-2 right-2 bg-green-500 rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-400 flex items-center justify-center
              ${isCurrentTrack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
            `}
                    >
                        {isCurrentPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                    </button>

                    {/* Add To Playlist Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                        title="Add to Playlist"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <h3 className={`font-bold truncate mb-1 ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
                    {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate hover:underline">{track.artist}</p>
            </div>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trackId={track.id}
            />
        </>
    );
};

export default TrackCard;
