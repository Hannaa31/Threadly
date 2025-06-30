import React, { useState,useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const {loginUser,registerUser}=useContext(ShopContext)
  const [currentState,setCurrentState]=useState('Login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const onSubmitHandler=async(e)=>{
    e.preventDefault();

    const {name, email, password}=formData;

    if(currentState==='Login'){
      await loginUser(email, password);
    }else{
      await registerUser(name, email, password);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState==='Login'?'':<input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} />}
      <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} />
      <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {/* <p className='cursor-pointer'>
          Forgot your password?
        </p> */}
        {
          currentState==='Login'
          ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      <button className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'>{currentState==='Login'?'Sign In':'Sign Up'}</button>
    </form>
  )
}

export default Login
