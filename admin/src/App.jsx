import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import {Route,Routes} from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl=import.meta.env.VITE_BACKEND_URL
export const currency='Rs. '

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  
  useEffect(() => {
  const checkAdmin = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/user/verify-admin', {
        withCredentials: true
      })
      if (response.data.success) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    } catch (err) {
      setLoggedIn(false)
    }
  }

  checkAdmin()
}, [])


  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {!loggedIn ? (
      <Login setLoggedIn={setLoggedIn} />): 
      (<>
      <Navbar setLoggedIn={setLoggedIn} />
      <hr />
      <div className='flex w-full'>
        <SideBar />
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/add' element={<Add />} />
            <Route path='/list' element={<List />} />
            <Route path='/allorders' element={<Orders />} />
          </Routes>
        </div>
      </div>
      </>)}
      
    </div>
  )
}

export default App
