import React, { useState, useEffect } from 'react';
import UserNavbar from '../../components/userNavbar';
import TrackList from '../../components/TrackList';
import RecentlyPlayed from '../../components/RecentlyPlayed';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import { Search } from 'lucide-react';

const userMusicDashboard = () => {
  const [songs, setSongs] = useState([]); // Default/All songs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  // Removed debouncedQuery state as we are doing client-side filtering now (instant)

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Initial Load (Default Songs)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const songsRes = await fetch('http://localhost:3000/api/tracks');
        if (!songsRes.ok) throw new Error("Failed to fetch songs");
        const songsData = await songsRes.json();
        setSongs(songsData);

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

  // Filter Songs Client-Side (Local Only)
  const filteredSongs = songs.filter(song => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = song.title.toLowerCase().includes(cleanQuery) ||
      song.artist.toLowerCase().includes(cleanQuery) ||
      (song.album && song.album.toLowerCase().includes(cleanQuery));

    const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className='flex h-screen bg-black text-white font-sans'>
      <UserNavbar />
      <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white tracking-tight">Home</h1>
            <p className="text-gray-400 text-sm mt-1">Your personal library and favorites</p>
          </div>


          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter your library..."
              className="bg-[#121212] border border-[#282828] text-white pl-12 pr-4 py-3 rounded-full w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Recently Played - Always visible unless filtering heavily? Let's keep it visible at top or hide when filtering? 
            Common pattern: Hide "Recently Played" if user is actively searching to reduce clutter.
        */}
        {!searchQuery && (
          <>
            <h1 className="text-3xl font-bold mb-6">Welcome Back, User</h1>
            <RecentlyPlayed />
          </>
        )}

        {/* Categories */}
        {!loading && !error && (
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/20 scale-105'
                  : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-transparent hover:border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search Results Header (Only if searching) */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              {filteredSongs.length > 0 ? 'Library Results' : 'No results found'}
            </h2>
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
          <EmptyState
            title="No songs found"
            message={searchQuery ? `Make sure "${searchQuery}" is in your library.` : "Your library is empty."}
          />
        )}

        {!loading && !error && filteredSongs.length > 0 && (
          <TrackList tracks={filteredSongs} />
        )}
      </div>
    </div>
  )
}

export default userMusicDashboard
