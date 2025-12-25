import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/adminLogin')
    }
    return (
        <div>
            <div className="bg-[#2A2A2E] w-[15%] h-[100vh] p-5 fixed">
                <div className="m-2">
                    <ul className=''>
                        <li>Dashboard</li>
                        <li>Upload Music</li>
                        <li>Library</li>
                        <li>User's</li>
                    </ul>
                </div>
                <div className="bg-[#1F1F23] h-[2px] w-11/12"></div>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        </div>
    )
}

export default sidebar
