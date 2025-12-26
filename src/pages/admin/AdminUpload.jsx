import React, { useState } from 'react'
import Sidebar from '../../components/sidebar'

const AdminUpload = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [category, setCategory] = useState('');
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('category', category);
        formData.append('song', songFile);
        formData.append('image', imageFile);

        const token = localStorage.getItem('token');
        if (!token) {
            alert("No token found. Please login as admin.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/songs/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                alert('Song Uploaded Successfully!')
                // Reset form
                setTitle('');
                setArtist('');
                setAlbum('');
                setCategory('');
                setSongFile(null);
                setImageFile(null);
                e.target.reset();
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.log(error)
            alert('Error connecting to server');
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-[15%] w-full p-10 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8 text-green-500">Upload New Music</h1>

                <div className="bg-[#181818] p-8 rounded-xl max-w-2xl border border-[#282828]">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Title</label>
                                <input type="text" placeholder="Song Title" className="p-3 bg-[#2A2A2E] border border-transparent focus:border-green-500 rounded text-white outline-none transition-colors" onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Artist</label>
                                <input type="text" placeholder="Artist Name" className="p-3 bg-[#2A2A2E] border border-transparent focus:border-green-500 rounded text-white outline-none transition-colors" onChange={e => setArtist(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Album</label>
                                <input type="text" placeholder="Album Name" className="p-3 bg-[#2A2A2E] border border-transparent focus:border-green-500 rounded text-white outline-none transition-colors" onChange={e => setAlbum(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Category</label>
                                <input type="text" placeholder="e.g. Pop, Jazz" className="p-3 bg-[#2A2A2E] border border-transparent focus:border-green-500 rounded text-white outline-none transition-colors" onChange={e => setCategory(e.target.value)} required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Song File (MP3)</label>
                            <input type="file" accept="audio/*" className="p-2 bg-[#2A2A2E] rounded text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-black hover:file:bg-green-400" onChange={e => setSongFile(e.target.files[0])} required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Cover Image</label>
                            <input type="file" accept="image/*" className="p-2 bg-[#2A2A2E] rounded text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-black hover:file:bg-green-400" onChange={e => setImageFile(e.target.files[0])} required />
                        </div>

                        <button disabled={loading} className="mt-4 bg-green-500 text-black font-bold p-3 rounded-full hover:bg-green-400 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
                            {loading ? 'Uploading...' : 'Upload Song'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminUpload
