import React from 'react';
import { useNavigate } from 'react-router-dom';

const PodcastCard = ({ podcast }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/user/podcast/${podcast.id}`)}
            className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] cursor-pointer transition duration-300 group"
        >
            <div className="relative mb-4">
                <img
                    src={podcast.image_url || "/default-podcast.png"}
                    alt={podcast.title}
                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                />
            </div>

            <div className="font-bold truncate text-white">
                {podcast.title}
            </div>
            <div className="text-sm text-gray-400 truncate">
                {podcast.publisher || "Unknown Host"}
            </div>
        </div>
    );
};

export default PodcastCard;
