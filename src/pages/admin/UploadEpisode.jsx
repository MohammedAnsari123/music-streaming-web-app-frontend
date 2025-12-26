import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { Upload, Mic, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

const UploadEpisode = () => {
    const [podcasts, setPodcasts] = useState([]);
    const [formData, setFormData] = useState({
        podcast_id: '',
        title: '',
        description: '',
        duration: '00:00'
    });
    const [audioFile, setAudioFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Fetch Pods for Dropdown
        fetch('http://localhost:3000/api/podcasts')
            .then(res => res.json())
            .then(data => setPodcasts(data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const data = new FormData();
        data.append('podcast_id', formData.podcast_id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('duration', formData.duration);
        data.append('audio', audioFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/admin/episodes', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Upload failed");

            setStatus({ type: 'success', message: 'Episode published successfully!' });
            setFormData({ ...formData, title: '', description: '' });
            setAudioFile(null);

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
                        <PlayCircle className="text-blue-500" /> Publish New Episode
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-[#181818] p-8 rounded-xl border border-[#282828]">

                        {status && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Select Podcast Channel</label>
                            <select
                                required
                                className="w-full bg-[#282828] border-transparent focus:border-blue-500 rounded p-3 outline-none text-white"
                                value={formData.podcast_id}
                                onChange={e => setFormData({ ...formData, podcast_id: e.target.value })}
                            >
                                <option value="">-- Start typing to search or select --</option>
                                {podcasts.map(pod => (
                                    <option key={pod.id} value={pod.id}>{pod.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Episode Title</label>
                            <input
                                type="text" required
                                className="w-full bg-[#282828] border-transparent focus:border-blue-500 rounded p-3 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description / Show Notes</label>
                            <textarea
                                required rows="4"
                                className="w-full bg-[#282828] border-transparent focus:border-blue-500 rounded p-3 outline-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="border-2 border-dashed border-[#333] hover:border-blue-500 rounded-xl p-6 text-center transition group cursor-pointer relative">
                            <input type="file" required id="ep-audio" accept="audio/*" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={e => setAudioFile(e.target.files[0])} />
                            <Mic size={32} className="mx-auto mb-3 text-gray-500 group-hover:text-blue-500 transition" />
                            <span className="block text-sm font-medium text-gray-300">
                                {audioFile ? audioFile.name : "Upload Episode Audio"}
                            </span>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                            {loading ? 'Uploading...' : 'Publish Episode'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadEpisode;
