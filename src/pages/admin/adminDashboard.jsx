import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar'
import { Music, Users, HardDrive } from 'lucide-react'

const AdminDashboard = () => {
    const [songs, setSongs] = useState([]);
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Parallel Fetch
            const [songsRes, podcastsRes] = await Promise.all([
                fetch('http://localhost:3000/api/songs/all'),
                fetch('http://localhost:3000/api/podcasts')
            ]);

            const songsData = await songsRes.json();
            const podcastsData = await podcastsRes.json();

            if (Array.isArray(songsData)) setSongs(songsData);
            if (Array.isArray(podcastsData)) setPodcasts(podcastsData);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteSong = async (id) => {
        if (confirm("Are you sure you want to delete this song?")) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/songs/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed');
                fetchData();
            } catch (error) {
                alert("Failed to delete song");
            }
        }
    }

    const handleDeletePodcast = async (id) => {
        if (confirm("Are you sure you want to delete this podcast? This will also delete all its episodes.")) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/admin/podcasts/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to delete podcast');
                }

                // Refresh
                fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete podcast: " + error.message);
            }
        }
    }

    // Calculate simple stats
    const totalSongs = songs.length;
    const totalPodcasts = podcasts.length;
    const totalArtists = new Set(songs.map(song => song.artist)).size;
    const totalCategories = new Set(songs.map(song => song.category)).size;

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-[15%] w-full p-10 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-xl flex items-center gap-4 shadow-lg">
                        <div className="bg-black/20 p-3 rounded-full">
                            <Music size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-green-100">Total Songs</h3>
                            <p className="text-3xl font-bold text-white">{totalSongs}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-xl flex items-center gap-4 shadow-lg">
                        <div className="bg-black/20 p-3 rounded-full">
                            <Users size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-indigo-100">Total Podcasts</h3>
                            <p className="text-3xl font-bold text-white">{totalPodcasts}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-purple-700 p-6 rounded-xl flex items-center gap-4 shadow-lg">
                        <div className="bg-black/20 p-3 rounded-full">
                            <Users size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-purple-100">Artists</h3>
                            <p className="text-3xl font-bold text-white">{totalArtists}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-xl flex items-center gap-4 shadow-lg">
                        <div className="bg-black/20 p-3 rounded-full">
                            <HardDrive size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-blue-100">Categories</h3>
                            <p className="text-3xl font-bold text-white">{totalCategories}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-1 gap-8">
                    {/* Songs Table */}
                    <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#282828]">
                        <div className="p-6 border-b border-[#282828]">
                            <h2 className="text-xl font-bold">Music Library</h2>
                        </div>
                        <div className="overflow-x-auto max-h-[400px]">
                            <table className="w-full text-left">
                                <thead className="bg-[#202020] text-gray-400 sticky top-0">
                                    <tr>
                                        <th className="p-4">Track</th>
                                        <th className="p-4">Artist</th>
                                        <th className="p-4">Album</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {songs.map(song => (
                                        <tr key={song.id} className="border-b border-[#282828] hover:bg-[#202020] transition-colors">
                                            <td className="p-4 flex items-center gap-4">
                                                <img src={song.image_url} alt="art" className="w-10 h-10 object-cover rounded shadow-md" />
                                                <span className="font-semibold">{song.title}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">{song.artist}</td>
                                            <td className="p-4 text-gray-400">{song.album || '-'}</td>
                                            <td className="p-4">
                                                <button onClick={() => handleDeleteSong(song.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Podcasts Table */}
                    <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#282828]">
                        <div className="p-6 border-b border-[#282828]">
                            <h2 className="text-xl font-bold">Podcast Library</h2>
                        </div>
                        <div className="overflow-x-auto max-h-[400px]">
                            <table className="w-full text-left">
                                <thead className="bg-[#202020] text-gray-400 sticky top-0">
                                    <tr>
                                        <th className="p-4">Podcast</th>
                                        <th className="p-4">Publisher</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {podcasts.map(pod => (
                                        <tr key={pod.id} className="border-b border-[#282828] hover:bg-[#202020] transition-colors">
                                            <td className="p-4 flex items-center gap-4">
                                                <img src={pod.image_url} alt="art" className="w-10 h-10 object-cover rounded shadow-md" />
                                                <span className="font-semibold">{pod.title}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">{pod.publisher}</td>
                                            <td className="p-4 text-gray-400 truncate max-w-[200px]">{pod.description}</td>
                                            <td className="p-4">
                                                <button onClick={() => handleDeletePodcast(pod.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {podcasts.length === 0 && !loading && (
                                        <tr><td colSpan="4" className="p-8 text-center text-gray-500">No podcasts found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
