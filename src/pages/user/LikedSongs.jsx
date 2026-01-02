import React, { useState, useEffect } from 'react';
import UserNavbar from '../../components/userNavbar';
import TrackList from '../../components/TrackList';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import { Heart } from 'lucide-react';

const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch favorites");
            const data = await res.json();
            setSongs(data);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex h-screen bg-black text-white font-sans'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">

                <div className="flex items-end gap-6 mb-8 border-b border-[#282828] pb-8">
                    <div className="w-40 h-40 bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center rounded-lg shadow-2xl">
                        <Heart size={64} fill="white" className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="uppercase text-sm font-bold tracking-wider">Playlist</p>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Liked Songs</h1>
                        <p className="text-gray-400 mt-2 font-medium">
                            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                        </p>
                    </div>
                </div>

                {loading && <LoadingSkeleton count={5} type="row" />}

                {error && (
                    <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && songs.length === 0 && (
                    <EmptyState
                        title="Songs you like will appear here"
                        message="Save songs by tapping the heart icon."
                    />
                )}

                {!loading && !error && songs.length > 0 && (
                    <TrackList tracks={songs} />
                )}
            </div>
        </div>
    );
};

export default LikedSongs;
