import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Upload, Library, Users, LogOut, Music } from 'lucide-react'

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login')
    }

    return (
        <div className="bg-black w-[15%] h-[100vh] p-6 fixed text-gray-300 border-r border-[#282828] flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-8 px-2 text-white">
                    <span className="text-2xl font-bold text-green-500">StreamLite</span>
                    <span className="text-xs border border-white px-1 rounded">ADMIN</span>
                </div>

                <nav>
                    <ul className='space-y-4'>
                        <li>
                            <Link to="/admin/dashboard" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                <LayoutDashboard size={24} />
                                <span className="font-semibold">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/upload" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                <Music size={24} />
                                <span className="font-semibold">Upload Tracks</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/upload-podcast" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                <div className="relative">
                                    <Upload size={24} />
                                    <span className="absolute -bottom-1 -right-1 text-[10px] bg-purple-500 px-1 rounded">POD</span>
                                </div>
                                <span className="font-semibold">Create Podcast</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/upload-episode" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer ml-3 border-l border-gray-700 pl-3'>
                                <span className="font-medium text-sm text-gray-400 hover:text-white">Add Episode</span>
                            </Link>
                        </li>
                        <li>
                            <div className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                <Library size={24} />
                                <span className="font-semibold">Library</span>
                            </div>
                        </li>
                        <li>
                            <div className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                <Users size={24} />
                                <span className="font-semibold">Users</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            <div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-2 text-gray-300 hover:text-white transition-colors w-full text-left">
                    <LogOut size={24} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
