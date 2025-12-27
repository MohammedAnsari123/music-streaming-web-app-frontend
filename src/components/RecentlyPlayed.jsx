import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { PlayCircle, Clock } from 'lucide-react';

const RecentlyPlayed = () => {
    const [recent, setRecent] = useState([]);
    const { playTrack } = useAudioPlayer();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            const token = localStorage.getItem('token');
            if (!token) return; // Silent fail if no token

            try {
                const res = await fetch('http://localhost:3000/api/recently-played', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/user/login');
                    return;
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setRecent(data);
                }
            } catch (err) {
                console.error("Error fetching recently played:", err);
            }
        };

        fetchRecent();
    }, []);

    if (recent.length === 0) return null;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                <Clock className="text-green-500" size={24} /> Jump Back In
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {recent.map((item, index) => {
                    const isMusic = item.type === 'music';
                    // Normalized data structure from backend might be nested
                    // item = { history_id, type, last_position, ...songs/episodes }
                    // Let's handle the flattened structure I returned from backend

                    const title = item.title; // Controller flattened it
                    const subtitle = isMusic ? item.artist : item.publisher;
                    const image = item.image_url;

                    return (
                        <div
                            key={item.history_id}
                            onClick={() => playTrack(item)}
                            className="min-w-[160px] w-[160px] bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
                        >
                            <div className="relative mb-3">
                                <img
                                    src={image || "https://via.placeholder.com/150"}
                                    alt={title}
                                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-md">
                                    <PlayCircle className="text-green-500 fill-current bg-black rounded-full" size={40} />
                                </div>
                                {/* Resume Bar (Optional Visual) */}
                                {item.last_position > 0 && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-b-md overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: '40%' }} // Approximation or calc if we had duration.
                                        // Since we might not have total duration here easily without joining more, 
                                        // we can skip the width % or just fix it to show "in progress"
                                        ></div>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-white truncate">{title}</h3>
                            <p className="text-sm text-gray-400 truncate">{subtitle}</p>
                            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                <Clock size={12} /> {formatTime(item.last_position)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentlyPlayed;
