import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/AnimatedBackground'

const adminLogin = () => {
    const [adminEmail, setAdminEmail] = useState('')
    const [adminPassword, setAdminPassword] = useState('')
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: adminEmail,
                    password: adminPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Admin Login Success')
                login(data.user, data.token)
                navigate('/admin/dashboard')
            } else {
                alert('Admin Login Failed')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden flex items-center justify-center">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8">
                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold tracking-widest text-green-500 uppercase border border-green-500/30 px-3 py-1 rounded-full bg-green-500/10">Admin Access</span>
                        <h1 className='text-4xl font-bold mt-4 text-white'>
                            Control Center
                        </h1>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2 pl-2">Email</label>
                            <input
                                className='w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all'
                                onChange={(e) => setAdminEmail(e.target.value)}
                                type="text"
                                placeholder='admin@streamlite.com'
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2 pl-2">Password</label>
                            <input
                                className='w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all'
                                onChange={(e) => setAdminPassword(e.target.value)}
                                type="password"
                                placeholder='••••••••'
                            />
                        </div>
                    </div>

                    <button className='w-full mt-8 h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg'>
                        Authenticate
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600">Restricted Area. Authorized Personnel Only.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default adminLogin
