import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const EpisodeItem = ({ episode, podcast }) => {
    const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

    const normalizedTrack = {
        id: episode.id,
        title: episode.title,
        artist: podcast.publisher || podcast.title,
        image_url: podcast.image_url,
        song_url: episode.audio_url
    };

    const isCurrent = currentTrack?.id === episode.id;

    const handlePlay = (e) => {
        e.stopPropagation();
        playTrack(normalizedTrack);
    };

    return (
        <div
            onClick={handlePlay}
            className={`flex items-center gap-4 p-3 rounded-md hover:bg-[#2a2a2a] group cursor-pointer transition-colors ${isCurrent ? 'bg-[#2a2a2a]' : ''}`}
        >
            <div className="text-gray-400 group-hover:text-white">
                {isCurrent && isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>
                    {episode.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                    {Math.floor(episode.duration / 60)} min • {new Date(episode.created_at || Date.now()).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default EpisodeItem;
