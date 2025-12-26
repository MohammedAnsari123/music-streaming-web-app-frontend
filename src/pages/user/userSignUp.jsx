import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const userSignUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/user/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            })
            const data = await response.json();

            if (response.ok) {
                alert("User Created Successfully!")
                register(data.user, data.token)
                navigate('/user/dashboard')
            } else {
                console.error("Signup Failed - Backend Response:", data);
                alert(data.error || 'User Creation failed')
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} action="">
                <div className="flex flex-col w-[100vw] h-[100vh]">
                    <div className="userSignUp p-10 rounded-2xl text-black m-auto">
                        <h1 className='text-center text-5xl mb-5'>Sign Up here</h1>
                        <div className="">
                            <h4 className='m-2 text-lg'>Enter Your Username</h4>
                            <input onChange={(e) => setUsername(e.target.value)} className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' type="text" placeholder='Username' />
                            <h4 className='m-2 text-lg'>Enter Your Email</h4>
                            <input onChange={(e) => setEmail(e.target.value)} className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' type="text" placeholder='email' />
                            <h4 className='m-2 text-lg'>Enter Your Password</h4>
                            <input onChange={(e) => setPassword(e.target.value)} className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' type="password" placeholder='password' />
                        </div>
                        <div className="flex justify-center items-center">
                            <button type='submit' disabled={loading} className='bg-black text-white w-[100px] h-[45px] my-3 rounded-3xl'>Sign Up</button>
                        </div>
                        <p>Login your Account <Link className='underline' to='/user/login'>Here!</Link></p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default userSignUp
