import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreatePlaylistModal = ({ isOpen, onClose, onPlaylistCreated }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!localStorage.getItem('token')) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('https://music-streaming-web-app-backend.onrender.com/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, description })
            });

            if (!res.ok) throw new Error("Failed to create playlist");

            const newPlaylist = await res.json();
            if (onPlaylistCreated) onPlaylistCreated(newPlaylist);
            onClose();
            setName('');
            setDescription('');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-[#181818] p-6 rounded-lg w-full max-w-md border border-[#282828]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Create Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#2a2a2a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
                            placeholder="My Awesome Playlist"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
                        <textarea
                            className="w-full bg-[#2a2a2a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:border-green-500 h-24"
                            placeholder="Give your playlist a catchy description."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-white hover:text-gray-300 font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
