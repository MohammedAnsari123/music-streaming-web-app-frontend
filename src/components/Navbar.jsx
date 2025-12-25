import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div>
            <div className="navbar flex items-center justify-evenly h-20">
                <div className="logo text-[#16A34A] text-3xl">StreamLite</div>
                <div className="btn flex gap-4">
                    <button className='bg-[#16A34A] px-6 py-2 rounded-full'><Link to='/adminLogin'>Admin Login</Link></button>
                    <button className='bg-[#16A34A] px-6 py-2 rounded-full'><Link to='/userLogin'>User Login</Link></button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
