import React, { useState, useEffect } from 'react';
import UserNavbar from '../../components/userNavbar';
import TrackList from '../../components/TrackList';
import RecentlyPlayed from '../../components/RecentlyPlayed';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const userMusicDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Songs
        const songsRes = await fetch('http://localhost:3000/api/tracks');
        if (!songsRes.ok) throw new Error("Failed to fetch songs");
        const songsData = await songsRes.json();
        setSongs(songsData);

        // Extract Categories
        const uniqueCategories = ['All', ...new Set(songsData.map(s => s.category).filter(Boolean))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='flex h-screen bg-black text-white'>
      <UserNavbar />
      <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Discovery</h1>

          <input
            type="text"
            placeholder="Search songs, artists..."
            className="bg-[#1e1e1e] border border-[#333] text-white px-4 py-2 rounded-full w-full md:w-96 focus:outline-none focus:border-green-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h1 className="text-3xl font-bold mb-6">Welcome Back, User</h1>

        {/* Day 9: Recently Played Section */}
        <RecentlyPlayed />

        {/* Loading State for Recently Played */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)}
          </div>
        )}

        {/* Category Tabs */}
        {!loading && !error && (
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? 'bg-green-500 text-black'
                  : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading && <LoadingSkeleton count={10} type="card" />}

        {error && (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            Error: {error}. Is the backend server running?
          </div>
        )}

        {!loading && !error && filteredSongs.length === 0 && (
          <EmptyState title="No music found" message="We couldn't find any tracks matching your search logic." />
        )}

        {!loading && !error && filteredSongs.length > 0 && (
          <TrackList tracks={filteredSongs} />
        )}
      </div>
    </div>
  )
}

export default userMusicDashboard
