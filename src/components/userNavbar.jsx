import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const userNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/')
    }
    return (
        <div>
            <div className="bg-[#2A2A2E] w-[15%] h-[100vh] p-5 fixed">
                <div className="">
                    <ul>
                        <li>Home</li>
                        <li>Search</li>
                        <li>Your Library</li>
                        <li>Liked Song's</li>
                    </ul>
                </div>
                <div className="bg-[#1F1F23] h-[2px] w-11/12"></div>
                <div className="">
                    <button onClick={handleLogout}>Sign Out</button>
                </div>
            </div>
        </div>
    )
}

export default userNavbar
