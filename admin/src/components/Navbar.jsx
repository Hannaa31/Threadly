import React from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Navbar = ({setLoggedIn}) => {
    const handleLogout=async()=>{
        try {
            await axios.post(backendUrl + '/api/user/logout', {}, { withCredentials: true })
            setLoggedIn(false)  // Go back to Login screen
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Logout failed")
            console.error(error)
        }
    }
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(16%,80px)]' src={assets.admin_logo} alt="" />
        <button onClick={handleLogout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
