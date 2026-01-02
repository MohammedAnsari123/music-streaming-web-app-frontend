import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/userNavbar';
import EpisodeItem from '../../components/EpisodeItem';
import { ArrowLeft } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const podcastRes = await fetch(`https://music-streaming-web-app-backend.onrender.com/api/podcasts/${id}`);
                if (!podcastRes.ok) throw new Error("Failed to fetch podcast details");
                const podcastData = await podcastRes.json();
                setPodcast(podcastData);

                const episodesRes = await fetch(`https://music-streaming-web-app-backend.onrender.com/api/podcasts/${id}/episodes`);
                if (!episodesRes.ok) throw new Error("Failed to fetch episodes");
                const episodesData = await episodesRes.json();
                setEpisodes(episodesData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className='flex h-screen bg-black text-white'>
                <UserNavbar />
                <div className="ml-0 md:ml-[15%] w-full p-8 pb-32">
                    <div className="w-32 h-6 bg-[#181818] rounded mb-6 animate-pulse"></div>

                    <div className="flex flex-col md:flex-row gap-8 mb-10 animate-pulse">
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-[#181818] rounded-lg"></div>
                        <div className="flex flex-col justify-end w-full space-y-4">
                            <div className="h-4 bg-[#181818] rounded w-24"></div>
                            <div className="h-12 bg-[#181818] rounded w-3/4"></div>
                            <div className="h-6 bg-[#181818] rounded w-1/2"></div>
                            <div className="h-4 bg-[#181818] rounded w-full"></div>
                        </div>
                    </div>

                    <div className="h-8 bg-[#181818] rounded w-1/4 mb-6 animate-pulse"></div>
                    <LoadingSkeleton count={5} type="list" />
                </div>
            </div>
        )
    }

    if (error) return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-10 text-red-500">Error: {error}</div>
        </div>
    );

    if (!podcast) return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-10 text-white">Podcast not found</div>
        </div>
    );

    return (
        <div className='flex h-screen bg-black text-white'>
            <UserNavbar />
            <div className="ml-0 md:ml-[15%] w-full p-4 md:p-8 pb-40 md:pb-32 overflow-y-auto">

                <button onClick={() => navigate('/user/podcasts')} className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back to Podcasts
                </button>

                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <img
                        src={podcast.image_url || "/default-podcast.png"}
                        alt={podcast.title}
                        className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-2xl"
                    />
                    <div className="flex flex-col justify-end">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-green-500 mb-2">Podcast</h4>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">{podcast.title}</h1>
                        <p className="text-gray-300 text-lg mb-4">{podcast.publisher}</p>
                        <p className="text-gray-400 max-w-2xl text-sm line-clamp-3">{podcast.description}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-4">Episodes ({episodes.length})</h2>
                <div className="flex flex-col gap-2">
                    {episodes.length === 0 ? (
                        <p className="text-gray-500">No episodes available.</p>
                    ) : (
                        (() => {
                            const normalizedEpisodes = episodes.map(ep => ({
                                id: ep.id,
                                title: ep.title,
                                artist: podcast.publisher || podcast.title,
                                image_url: podcast.image_url,
                                audio_url: ep.audio_url,
                                duration: ep.duration,
                                created_at: ep.created_at
                            }));

                            return normalizedEpisodes.map(ep => (
                                <EpisodeItem key={ep.id} episode={ep} contextQueue={normalizedEpisodes} />
                            ));
                        })()
                    )}
                </div>
            </div>
        </div>
    );
};

export default PodcastDetail;
