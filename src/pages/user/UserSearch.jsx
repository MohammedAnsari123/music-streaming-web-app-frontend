import React, { useState, useEffect } from 'react';
import UserNavbar from '../../components/userNavbar';
import TrackList from '../../components/TrackList';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import { Search } from 'lucide-react';

const UserSearch = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Perform Search
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setSearchResults(data);
            } catch (err) {
                console.error("Search Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedQuery.length > 0) {
            performSearch();
        } else {
            setSearchResults([]);
        }
    }, [debouncedQuery]);


    return (
        <div className='flex h-screen bg-black text-white font-sans'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">
                <div className="flex flex-col gap-6 max-w-5xl mx-auto">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Search</h1>
                        <p className="text-gray-400">Find songs, artists, and podcasts from across the web.</p>
                    </div>

                    <div className="relative w-full group">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="What do you want to listen to?"
                            className="bg-[#242424] border-transparent text-white pl-16 pr-6 py-4 rounded-full w-full text-lg font-medium focus:outline-none focus:bg-[#333] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Results Area */}
                    <div className="mt-8">
                        {searchQuery && debouncedQuery && (
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Top Results</h2>
                                {!loading && (
                                    <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                        {searchResults.length} matches
                                    </span>
                                )}
                            </div>
                        )}

                        {loading && <LoadingSkeleton count={10} type="card" />}

                        {error && (
                            <div className="text-red-400 text-center py-10 bg-red-500/10 rounded-xl">
                                Error connecting to search service. Please try again.
                            </div>
                        )}

                        {!loading && !error && searchResults.length === 0 && searchQuery.length > 2 && (
                            <EmptyState
                                title="No matches found"
                                message={`We couldn't find anything for "${searchQuery}". Try broader keywords.`}
                            />
                        )}

                        {!loading && !error && searchResults.length === 0 && searchQuery.length <= 2 && (
                            <div className="text-center py-20">
                                <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
                                    <Search size={48} className="text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Play what you love</h3>
                                <p className="text-gray-400">Search for tracks, albums, or artists.</p>
                            </div>
                        )}

                        {!loading && !error && searchResults.length > 0 && (
                            <TrackList tracks={searchResults} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserSearch
