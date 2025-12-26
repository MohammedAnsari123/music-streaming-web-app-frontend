import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { PlayCircle, Headphones, Radio, Mic2 } from 'lucide-react'

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/40 via-black to-black z-0"></div>

                <div className="z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                        Music for <span className="text-green-500">everyone.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
                        millions of songs. No credit card needed. Just hit play.
                    </p>
                    <div className="pt-8">
                        <Link to="/user/signup" className="bg-green-500 text-black text-xl font-bold px-10 py-4 rounded-full hover:bg-green-400 hover:scale-105 transition-all shadow-lg shadow-green-500/20">
                            GET STREAMLITE FREE
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 px-4">
                        <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                            Why StreamLite?
                        </span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300 border border-white/5 hover:border-green-500/30">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <PlayCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Play your favorites</h3>
                            <p className="text-gray-400">Listen to the songs you love and discover new music and podcasts.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300 border border-white/5 hover:border-purple-500/30">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500">
                                <Headphones size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Playlists made easy</h3>
                            <p className="text-gray-400">We'll help you make playlists. Or enjoy playlists made by music experts.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300 border border-white/5 hover:border-blue-500/30">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                                <Radio size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Make it yours</h3>
                            <p className="text-gray-400">Tell us what you like, and we'll recommend music for you.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300 border border-white/5 hover:border-pink-500/30">
                            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                                <Mic2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Save mobile data</h3>
                            <p className="text-gray-400">To use less data when you play music, turn on Data Saver in Settings.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-green-500/5 blur-3xl rounded-full translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            About <span className="text-green-500">StreamLite</span>
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            StreamLite is a next-generation digital media player designed for simplicity and speed.
                            Born from a passion for music, our goal is to connect artists with listeners through a
                            seamless, ad-free experience. Whether you're discovering new indie tracks or jamming
                            to classics, StreamLite provides the platform you need.
                        </p>
                        <div className="pt-8 grid grid-cols-3 gap-8 text-center border-t border-gray-800 mt-12">
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">1M+</h4>
                                <p className="text-green-500 uppercase text-sm tracking-wider">Songs</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">Free</h4>
                                <p className="text-green-500 uppercase text-sm tracking-wider">Forever</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">0</h4>
                                <p className="text-green-500 uppercase text-sm tracking-wider">Ads</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-gray-900">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="text-2xl font-bold text-white">StreamLite</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Legal</a>
                        <a href="#" className="hover:text-white">Privacy Center</a>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                        <a href="#" className="hover:text-white">About Ads</a>
                    </div>
                    <div className="mt-4 md:mt-0">
                        &copy; 2024 StreamLite AB
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
