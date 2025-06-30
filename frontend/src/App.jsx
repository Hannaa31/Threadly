import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const App = () => {
  const stripePromise = loadStripe('pk_test_51RfNR4P1Ld5e1pAhLkPhFybKkVaOmkKtUkG5Qt4tgPt2ybEKX8ASUIwtLR9zTOWjbEN3V38SJs1XfaNTfY7e7CLd008HyQhJaX');
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/orders' element={
          <ProtectedRoute>
            <Orders/>
          </ProtectedRoute>
          } />
        <Route path='/placeorder' element={
          <ProtectedRoute>
            <Elements stripe={stripePromise}>
              <PlaceOrder />
            </Elements>
          </ProtectedRoute>
          } />
          {/* <Route path="/profile" element={
            <ProtectedRoute>
            <Profile />
            </ProtectedRoute>
          } /> */}
        <Route path='/product' element={<Product/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
