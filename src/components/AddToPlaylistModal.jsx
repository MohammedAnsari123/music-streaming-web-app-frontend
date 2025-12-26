import React, { useState, useEffect } from 'react';
import { Plus, X, Music } from 'lucide-react';

const AddToPlaylistModal = ({ isOpen, onClose, trackId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(null); // Playlist ID being added to
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
        }
    }, [isOpen]);

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/playlists', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch playlists");
            const data = await res.json();
            setPlaylists(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        setAdding(playlistId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ trackId })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to add track");
            }

            // Success feedback? Close modal?
            onClose(); // Or show a toast message
        } catch (err) {
            alert(err.message); // Simple alert for now
        } finally {
            setAdding(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-[#181818] p-6 rounded-lg w-full max-w-sm border border-[#282828] max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading playlists...</div>
                ) : (
                    <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                        {playlists.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No playlists found. Create one first!</p>
                        ) : (
                            playlists.map(playlist => (
                                <button
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                    disabled={adding === playlist.id}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-[#282828] rounded-md transition text-left"
                                >
                                    <div className="bg-[#333] p-2 rounded">
                                        <Music size={20} className="text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white truncate">{playlist.name}</h4>
                                        <p className="text-xs text-gray-500">By You</p>
                                    </div>
                                    {adding === playlist.id && (
                                        <div className="animate-spin h-4 w-4 border-2 border-green-500 rounded-full border-t-transparent"></div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
