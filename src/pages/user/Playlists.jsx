import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/userNavbar';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import { Plus, Music } from 'lucide-react';

const Playlists = () => {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('http://localhost:3000/api/playlists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/user/login');
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch playlists");
            const data = await res.json();
            setPlaylists(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistCreated = (newPlaylist) => {
        setPlaylists([newPlaylist, ...playlists]);
    };

    return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Library</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full flex items-center gap-2 transition"
                    >
                        <Plus size={20} /> Create Playlist
                    </button>
                </div>

                {loading && <LoadingSkeleton count={4} type="card" />}
                {error && <div className="text-red-500">Error: {error}</div>}

                {!loading && !error && playlists.length === 0 && (
                    <EmptyState
                        title="Create your first playlist"
                        message="It's easy, we'll help you."
                    />
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map(playlist => (
                        <div
                            key={playlist.id}
                            onClick={() => navigate(`/user/playlist/${playlist.id}`)}
                            className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
                        >
                            <div className="w-full aspect-square bg-[#333] rounded-md mb-4 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition">
                                <Music size={48} className="text-gray-500" />
                            </div>
                            <h3 className="font-bold truncate text-white">{playlist.name}</h3>
                            <p className="text-sm text-gray-400 truncate">By You</p>
                        </div>
                    ))}
                </div>

                <CreatePlaylistModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onPlaylistCreated={handlePlaylistCreated}
                />
            </div>
        </div>
    );
};

export default Playlists;
