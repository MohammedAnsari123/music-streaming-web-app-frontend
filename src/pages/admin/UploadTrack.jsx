import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const UploadTrack = () => {
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        album: '',
        category: 'Pop' // Default
    });
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const CATEGORIES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical', 'Indie', 'Podcast'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        if (!songFile || !imageFile) {
            setStatus({ type: 'error', message: 'Both Audio and Image files are required.' });
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('album', formData.album);
        data.append('category', formData.category);
        data.append('song', songFile);
        data.append('image', imageFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/admin/tracks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data // FormData sets Content-Type boundary automatically
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || result.error || "Upload failed");

            setStatus({ type: 'success', message: 'Track uploaded successfully!' });
            // Reset form
            setFormData({ title: '', artist: '', album: '', category: 'Pop' });
            setSongFile(null);
            setImageFile(null);

        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-[15%] w-full p-10 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Upload className="text-green-500" /> Upload New Track
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-[#181818] p-8 rounded-xl border border-[#282828]">

                        {/* Status Message */}
                        {status && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {status.message}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#282828] border border-transparent focus:border-green-500 rounded p-3 outline-none transition"
                                    placeholder="Song Title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Artist</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#282828] border border-transparent focus:border-green-500 rounded p-3 outline-none transition"
                                    placeholder="Artist Name"
                                    value={formData.artist}
                                    onChange={e => setFormData({ ...formData, artist: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Album (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#282828] border border-transparent focus:border-green-500 rounded p-3 outline-none transition"
                                    placeholder="Album Name"
                                    value={formData.album}
                                    onChange={e => setFormData({ ...formData, album: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                                <select
                                    className="w-full bg-[#282828] border border-transparent focus:border-green-500 rounded p-3 outline-none transition text-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="border-2 border-dashed border-[#333] hover:border-green-500 rounded-xl p-6 text-center transition group">
                                <input
                                    type="file"
                                    id="audio-upload"
                                    accept="audio/*"
                                    className="hidden"
                                    onChange={e => setSongFile(e.target.files[0])}
                                />
                                <label htmlFor="audio-upload" className="cursor-pointer block">
                                    <Music size={32} className="mx-auto mb-3 text-gray-500 group-hover:text-green-500 transition" />
                                    <span className="block text-sm font-medium text-gray-300">
                                        {songFile ? songFile.name : "Choose Audio File"}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">MP3, WAV, M4A (Max 50MB)</span>
                                </label>
                            </div>

                            <div className="border-2 border-dashed border-[#333] hover:border-green-500 rounded-xl p-6 text-center transition group">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => setImageFile(e.target.files[0])}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer block">
                                    <ImageIcon size={32} className="mx-auto mb-3 text-gray-500 group-hover:text-green-500 transition" />
                                    <span className="block text-sm font-medium text-gray-300">
                                        {imageFile ? imageFile.name : "Choose Artwork"}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-full font-bold text-lg mt-8 transition-all transform hover:scale-[1.01] ${loading ? 'bg-green-800 cursor-wait opacity-70' : 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
                                }`}
                        >
                            {loading ? 'Uploading...' : 'Publish Track'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadTrack;
