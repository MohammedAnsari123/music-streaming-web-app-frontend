import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { Upload, Mic, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const UploadPodcast = () => {
    const [formData, setFormData] = useState({
        title: '',
        publisher: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        if (!imageFile) {
            setStatus({ type: 'error', message: 'Cover Image is required.' });
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('publisher', formData.publisher);
        data.append('description', formData.description);
        data.append('image', imageFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/admin/podcasts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Upload failed");

            setStatus({ type: 'success', message: 'Podcast created successfully!' });
            setFormData({ title: '', publisher: '', description: '' });
            setImageFile(null);

        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    // ... (Almost identical UI structure to UploadTrack, simplified for brevity)
    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-[15%] w-full p-10 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Mic className="text-purple-500" /> Create New Podcast
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-[#181818] p-8 rounded-xl border border-[#282828]">

                        {status && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Podcast Title</label>
                            <input
                                type="text" required
                                className="w-full bg-[#282828] border-transparent focus:border-purple-500 rounded p-3 outline-none duration-200"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Publisher / Host</label>
                            <input
                                type="text" required
                                className="w-full bg-[#282828] border-transparent focus:border-purple-500 rounded p-3 outline-none duration-200"
                                value={formData.publisher}
                                onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea
                                required rows="4"
                                className="w-full bg-[#282828] border-transparent focus:border-purple-500 rounded p-3 outline-none duration-200"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="border-2 border-dashed border-[#333] hover:border-purple-500 rounded-xl p-6 text-center transition group cursor-pointer relative">
                            <input type="file" id="cover-upload" accept="image/*" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={e => setImageFile(e.target.files[0])} />
                            <ImageIcon size={32} className="mx-auto mb-3 text-gray-500 group-hover:text-purple-500 transition" />
                            <span className="block text-sm font-medium text-gray-300">
                                {imageFile ? imageFile.name : "Upload Cover Art"}
                            </span>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create Podcast'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPodcast;
