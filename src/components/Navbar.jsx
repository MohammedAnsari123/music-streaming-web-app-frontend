import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Music className="text-green-500" size={32} />
                    <span className="text-white text-2xl font-bold tracking-tight">StreamLite</span>
                </div>

                <div className="hidden md:flex gap-8 text-gray-300 font-medium">
                    <a href="#features" className="hover:text-green-500 transition-colors">Features</a>
                    <a href="#about" className="hover:text-green-500 transition-colors">About</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to='/user/login' className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                        Log in
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
