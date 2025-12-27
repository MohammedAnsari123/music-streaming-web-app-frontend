import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Home, Search, Library, Heart, LogOut } from 'lucide-react'

const UserNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/user/login')
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex bg-black w-[15%] h-[100vh] p-6 fixed text-gray-300 border-r border-[#282828] flex-col justify-between top-0 left-0 z-40">
                <div>
                    <div className="mb-8 px-2 text-white">
                        <span className="text-2xl font-bold text-green-500">StreamLite</span>
                    </div>

                    <nav>
                        <ul className='space-y-4'>
                            <li>
                                <Link to="/user/dashboard" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                    <Home size={24} />
                                    <span className="font-bold">Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/search" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                    <Search size={24} />
                                    <span className="font-bold">Search</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/library" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                    <Library size={24} />
                                    <span className="font-bold">Your Library</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/podcasts" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                    <span className="text-xl font-bold">🎙️</span>
                                    <span className="font-bold">Podcasts</span>
                                </Link>
                            </li>
                            <li className='pt-4'>
                                <Link to="/user/liked" className='flex items-center gap-3 px-2 hover:text-white transition-colors cursor-pointer'>
                                    <div className="bg-gradient-to-br from-indigo-700 to-blue-300 p-1 rounded-sm opacity-90">
                                        <Heart size={16} fill='white' color='white' />
                                    </div>
                                    <span className="font-bold">Liked Songs</span>
                                </Link>
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

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-black border-t border-[#282828] text-gray-400 flex justify-around items-center z-50">
                <Link to="/user/dashboard" className='flex flex-col items-center gap-1 hover:text-white'>
                    <Home size={20} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link to="/user/search" className='flex flex-col items-center gap-1 hover:text-white'>
                    <Search size={20} />
                    <span className="text-[10px] font-medium">Search</span>
                </Link>
                <Link to="/user/podcasts" className='flex flex-col items-center gap-1 hover:text-white'>
                    <span className="text-xl">🎙️</span>
                    <span className="text-[10px] font-medium">Podcasts</span>
                </Link>
                <button onClick={handleLogout} className='flex flex-col items-center gap-1 hover:text-white'>
                    <LogOut size={20} />
                    <span className="text-[10px] font-medium">Out</span>
                </button>
            </div>
        </>
    )
}

export default UserNavbar
