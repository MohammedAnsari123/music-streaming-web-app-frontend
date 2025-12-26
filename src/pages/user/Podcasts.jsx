import React, { useEffect, useState } from 'react';
import UserNavbar from '../../components/userNavbar';
import PodcastCard from '../../components/PodcastCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const Podcasts = () => {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/podcasts');
                if (!res.ok) throw new Error("Failed to fetch podcasts");
                const data = await res.json();
                setPodcasts(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcasts();
    }, []);

    return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Podcasts</h1>

                {loading && <LoadingSkeleton count={8} type="card" />}
                {error && <div className="text-red-500">Error: {error}</div>}

                {!loading && !error && podcasts.length === 0 && (
                    <EmptyState title="No Podcasts" message="Check back later for new content." />
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {podcasts.map(podcast => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Podcasts;
