import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Heart } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import AddToPlaylistModal from './AddToPlaylistModal';

const TrackCard = ({ track }) => {
    const { currentTrack, isPlaying, togglePlayPause, playTrack } = useAudioPlayer();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Initial Check
    useEffect(() => {
        if (!track) return;
        const checkLike = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`http://localhost:3000/api/favorites/check/${track.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setIsLiked(data.liked);
            } catch (err) {
                console.error(err);
            }
        };
        checkLike();
    }, [track]);

    // Safety check
    if (!track) return null;

    const isCurrentTrack = currentTrack?.id === track.id;
    const isCurrentPlaying = isCurrentTrack && isPlaying;

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (!track.audio_url && track.source !== 'local' && track.source !== 'internet_archive' && track.source !== 'spotify') {
            console.error("Missing audio_url for track:", track);
            // alert("Cannot play this track: invalid URL"); // Optional
            return;
        }

        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(track);
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        // Optimistic UI
        const newStatus = !isLiked;
        setIsLiked(newStatus);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/favorites/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ track })
            });
            if (!res.ok) throw new Error("Failed");
        } catch (err) {
            setIsLiked(!newStatus); // Revert
            console.error("Like failed", err);
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
                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-cover.png"; }}
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

                    {/* Add To Playlist Button (Top Right) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                        title="Add to Playlist"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className={`font-bold truncate mb-1 ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
                            {track.title}
                        </h3>
                        <p className="text-sm text-gray-400 truncate hover:underline">{track.artist}</p>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        className={`hover:scale-110 transition-transform ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                track={track}
            />
        </>
    );
};

export default TrackCard;
