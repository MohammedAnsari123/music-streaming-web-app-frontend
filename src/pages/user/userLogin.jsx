import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const userLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/user/login', {
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
        <div>
            <form onSubmit={handleSubmit} action="">
                <div className="flex flex-col w-[100vw] h-[100vh]">
                    <div className="userLogin p-10 rounded-2xl text-black m-auto">
                        <h1 className='text-center text-5xl mb-5'>Login here</h1>
                        <div className="">
                            <h4 className='m-2 text-lg'>Enter Your Email</h4>
                            <input onChange={(e) => setEmail(e.target.value)} className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' type="text" placeholder='email' />
                            <h4 className='m-2 text-lg'>Enter Your Password</h4>
                            <input onChange={(e) => setPassword(e.target.value)} className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' type="password" placeholder='password' />
                        </div>
                        <div className="flex justify-center items-center">
                            <button disabled={loading} className='bg-black text-white w-[100px] h-[45px] my-3 rounded-3xl'>Login</button>
                        </div>
                        <p>Create a New Account <Link className='underline' to='/user/signup'>Here!</Link></p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default userLogin
