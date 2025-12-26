import React from 'react';
import TrackCard from './TrackCard';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const TrackList = ({ tracks }) => {
    const { currentTrack, isPlaying, playTrack } = useAudioPlayer();

    if (!tracks || tracks.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tracks.map((track) => (
                <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={playTrack}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying}
                />
            ))}
        </div>
    );
};

export default TrackList;
