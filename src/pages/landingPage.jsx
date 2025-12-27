import React, { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { PlayCircle, Headphones, Radio, Mic2, Music2, Play } from 'lucide-react'

const LandingPage = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle System
        const particleCount = 100;
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            // Randomize between Green and a subtle Purple for variety
            color: Math.random() > 0.5 ? '34, 197, 94' : '168, 85, 247',
            opacity: Math.random() * 0.5 + 0.2,
        }));

        const animate = () => {
            // Trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
                ctx.fill();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach((p2) => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        // Use the color of p1 for the line
                        ctx.strokeStyle = `rgba(${p1.color}, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
            {/* Animated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full z-0 opacity-60 pointer-events-none"
            />

            {/* Ambient Gradients - Fixed position to stay behind everything */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">

                    {/* Floating Icons */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                        <div className="absolute top-1/4 left-1/4 animate-bounce delay-100 opacity-50">
                            <Music2 className="w-12 h-12 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                        </div>
                        <div className="absolute top-1/3 right-1/4 animate-bounce delay-700 opacity-50">
                            <Headphones className="w-16 h-16 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
                        </div>
                        <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-500 opacity-30">
                            <Radio className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>

                    <div className="z-20 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 leading-tight backdrop-blur-sm bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Feel the <span className="text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">Music.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                            Discover millions of songs, create playlists, and vibe with your favorite artists.
                            <br /><span className="text-green-400 font-medium">No Ads. No Limits. Just Play.</span>
                        </p>
                        <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/user/signup" className="group relative px-8 py-4 bg-green-500 rounded-full font-bold text-black text-lg transition-all hover:scale-105 hover:bg-green-400 shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center gap-3">
                                <Play className="fill-black w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Start Listening Free
                            </Link>
                            <a href="#features" className="px-8 py-4 rounded-full font-bold text-white text-lg border border-white/20 hover:bg-white/10 transition-all backdrop-blur-md">
                                Explore Features
                            </a>
                        </div>
                    </div>

                    {/* Animated Wave Bars at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-24 px-4 opacity-50">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-green-500/50 w-2 rounded-t-full"
                                style={{
                                    height: '20%',
                                    animation: `wave 1.5s ease-in-out infinite`,
                                    animationDelay: `${i * 0.05}s`,
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 relative bg-black/40 backdrop-blur-sm border-t border-white/5">
                    <div className="container mx-auto px-6">
                        <h2 className="text-5xl font-bold text-center mb-20 px-4">
                            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                                Why StreamLite?
                            </span>
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: PlayCircle, color: "text-green-500", bg: "bg-green-500/10", border: "hover:border-green-500/50", title: "Unlimited Playback", desc: "No skip limits. Just endless music flow." },
                                { icon: Headphones, color: "text-purple-500", bg: "bg-purple-500/10", border: "hover:border-purple-500/50", title: "Curated Playlists", desc: "Hand-picked daily mixes just for your mood." },
                                { icon: Radio, color: "text-blue-500", bg: "bg-blue-500/10", border: "hover:border-blue-500/50", title: "Smart Radio", desc: "Discover new gems based on what you love." },
                                { icon: Mic2, color: "text-pink-500", bg: "bg-pink-500/10", border: "hover:border-pink-500/50", title: "Hi-Fi Audio", desc: "Crystal clear sound quality for the audiophiles." }
                            ].map((feature, idx) => (
                                <div key={idx} className={`p-8 rounded-3xl bg-[#121212]/80 backdrop-blur-md border border-white/5 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group ${feature.border}`}>
                                    <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                                        <feature.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About/Stats Section (Refined) */}
                <section id="about" className="py-24 relative overflow-hidden bg-black/60 backdrop-blur-md border-t border-white/5">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-12">
                            <h2 className="text-4xl md:text-5xl font-bold">
                                Music for <span className="text-green-500">Every Moment</span>
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                                StreamLite isn't just a player; it's an experience. We've stripped away the noise
                                to bring you closer to the music you love, completely free.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                                <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                                    <div className="text-5xl font-bold text-white mb-2">1M+</div>
                                    <div className="text-green-400 font-medium tracking-wider uppercase text-sm">Tracks Available</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                                    <div className="text-5xl font-bold text-white mb-2">0</div>
                                    <div className="text-green-400 font-medium tracking-wider uppercase text-sm">Ad Interruptions</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                                    <div className="text-5xl font-bold text-white mb-2">100%</div>
                                    <div className="text-green-400 font-medium tracking-wider uppercase text-sm">Free Forever</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black py-12 border-t border-gray-900/50 backdrop-blur-xl relative z-20">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <span className="text-2xl font-bold text-white tracking-widest">Stream<span className="text-green-500">Lite</span></span>
                        </div>
                        <div className="flex gap-8 font-medium">
                            <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-green-400 transition-colors">Creators</a>
                            <a href="#" className="hover:text-green-400 transition-colors">About</a>
                        </div>
                        <div className="mt-4 md:mt-0 opacity-60">
                            &copy; 2024 StreamLite Inc.
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                @keyframes wave {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
            `}</style>
        </div>
    )
}

export default LandingPage
