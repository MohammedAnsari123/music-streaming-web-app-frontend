import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
                navigate('/adminDashboard')
            } else {
                alert('Admin Login Failed')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} action="">
                <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
                    <div className="adminLogin p-7 rounded-2xl flex flex-col justify-center items-center">
                        <h1 className='text-center text-5xl mb-5'>Admin Login</h1>
                        <div className="bg-[#2A2A2E] h-[1px] w-11/12"></div>
                        <div className="">
                            <h4 className="m-2 text-lg">Enter Admin Email</h4>
                            <input className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' onChange={(e) => setAdminEmail(e.target.value)} type="text" />
                            <h4 className="m-2 text-lg">Enter Admin Password</h4>
                            <input className='mx-5 my-1 w-72 h-12 p-2 text-black rounded-3xl items-center' onChange={(e) => setAdminPassword(e.target.value)} type="password" />
                        </div>
                        <div className="flex justify-center items-center">
                            <button  className='bg-black text-white px-12 py-2 my-3 rounded-3xl'>Admin Login</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default adminLogin
