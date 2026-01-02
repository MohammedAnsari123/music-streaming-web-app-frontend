import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/AnimatedBackground'

const userLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://music-streaming-web-app-backend.onrender.com/api/user/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json();

            if (response.ok) {
                alert("Login Successful!")
                login(data.user, data.token)
                navigate('/user/dashboard')
            } else {
                alert(data.error || 'Login failed')
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden flex items-center justify-center">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8">
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
                    <h1 className='text-center text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>
                        Welcome Back
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 pl-2">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full h-12 px-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all'
                                type="text"
                                placeholder='Enter your email'
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 pl-2">Password</label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full h-12 px-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all pr-12'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter your password'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className='w-full mt-8 h-12 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="mt-6 text-center text-gray-400 text-sm">
                        Don't have an account?
                        <Link className='ml-2 text-green-400 hover:text-green-300 font-medium hover:underline' to='/user/signup'>
                            Sign up here
                        </Link>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default userLogin
