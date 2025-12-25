import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar'

const adminDashboard = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [category, setCategory] = useState('');
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState([]);

    const fetchSongs = async () => {
        const res = await fetch('http://localhost:3000/api/songs/all');
        const data = await res.json();
        setSongs(data);
    };

    useEffect(() => {
        fetchSongs();
    }, []);

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

        try {
            const res = await fetch('http://localhost:3000/api/songs/add', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                alert('Song Upload!')
                fetchSongs();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await fetch(`http://localhost:3000/api/songs/delete/${id}`, {
                method: 'DELETE'
            });
            fetchSongs();
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-[20%] w-full p-10">
                <h1 className="text-3xl font-bold mb-5">Upload New Music</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mb-10">
                    <input type="text" placeholder="Title" className="p-2 border rounded text-black" onChange={e => setTitle(e.target.value)} required />
                    <input type="text" placeholder="Artist" className="p-2 border rounded text-black" onChange={e => setArtist(e.target.value)} required />
                    <input type="text" placeholder="Album" className="p-2 border rounded text-black" onChange={e => setAlbum(e.target.value)} />
                    <input type="text" placeholder="Category" className="p-2 border rounded text-black" onChange={e => setCategory(e.target.value)} required />

                    <label>Song File (MP3)</label>
                    <input type="file" accept="audio/*" onChange={e => setSongFile(e.target.files[0])} required />
                    <label>Cover Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required />
                    <button disabled={loading} className="bg-green-500 text-white p-2 rounded">
                        {loading ? 'Uploading...' : 'Upload Song'}
                    </button>
                </form>
                <h2 className="text-2xl font-bold mb-4">All Songs</h2>
                <ul>
                    {songs.map(song => (
                        <li key={song.id} className="flex justify-between items-center p-2 border-b">
                            <div className="flex items-center gap-3">
                                <img src={song.image_url} alt="art" className="w-10 h-10 object-cover rounded" />
                                <div>
                                    <p className="font-bold">{song.title}</p>
                                    <p className="text-sm text-gray-500">{song.artist}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(song.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default adminDashboard
