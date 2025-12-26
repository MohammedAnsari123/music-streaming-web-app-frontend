import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/userNavbar';
import { ArrowLeft, Play, Music, Trash2 } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playTrack } = useAudioPlayer();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlaylistDetails();
    }, [id]);

    const fetchPlaylistDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/playlists/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch playlist");
            const data = await res.json();
            setPlaylist(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTrack = async (trackId) => {
        if (!confirm("Remove this track from playlist?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/playlists/${id}/tracks/${trackId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to remove track");

            // Optimistic update
            setPlaylist(prev => ({
                ...prev,
                tracks: prev.tracks.filter(t => t.id !== trackId)
            }));
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePlayPlaylist = () => {
        if (playlist?.tracks?.length > 0) {
            playTrack(playlist.tracks[0]);
            // Ideally should queue the rest, but for now playing first is good start
        }
    };

    if (loading) return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-8">
                <LoadingSkeleton count={1} type="list" />
            </div>
        </div>
    );

    if (error) return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-8 text-red-500">Error: {error}</div>
        </div>
    );

    if (!playlist) return null;

    return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">
                <button onClick={() => navigate('/user/library')} className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back to Library
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 mb-10 items-end bg-gradient-to-b from-[#444] to-transparent p-6 rounded-t-xl -mx-4 md:-mx-8 md:p-8">
                    <div className="w-48 h-48 md:w-60 md:h-60 bg-[#282828] shadow-2xl flex items-center justify-center shrink-0">
                        <Music size={80} className="text-gray-500" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
                        <h1 className="text-4xl md:text-7xl font-black truncate py-2">{playlist.name}</h1>
                        <p className="text-gray-300 text-sm mt-2">{playlist.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="font-bold">You</span>
                            <span className="text-gray-400">• {playlist.tracks?.length || 0} songs</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mb-8 px-2">
                    {playlist.tracks?.length > 0 && (
                        <button
                            onClick={handlePlayPlaylist}
                            className="bg-green-500 rounded-full p-4 hover:scale-105 transition shadow-lg text-black"
                        >
                            <Play size={24} fill="black" />
                        </button>
                    )}
                </div>

                {/* Track List */}
                <div className="flex flex-col">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-[#333] text-gray-400 text-sm uppercase mb-2">
                        <span>#</span>
                        <span>Title</span>
                        <span>Time</span>
                    </div>

                    {playlist.tracks?.map((track, index) => (
                        <div key={track.id} className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 hover:bg-[#ffffff1a] rounded-md group items-center transition">
                            <span className="text-gray-400 w-4">{index + 1}</span>
                            <div className="flex items-center gap-4">
                                <img src={track.image_url} alt="" className="w-10 h-10 rounded" />
                                <div>
                                    <div
                                        className="font-bold text-white hover:underline cursor-pointer"
                                        onClick={() => playTrack(track)}
                                    >
                                        {track.title}
                                    </div>
                                    <div className="text-sm text-gray-400">{track.artist}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 text-sm">{track.duration}</span>
                                <button
                                    onClick={() => handleRemoveTrack(track.id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    title="Remove from playlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {(!playlist.tracks || playlist.tracks.length === 0) && (
                        <div className="text-center py-12 text-gray-500">
                            This playlist is empty. Add some tracks!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;
