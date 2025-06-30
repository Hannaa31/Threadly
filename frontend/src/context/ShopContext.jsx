import React, { useEffect, useState } from 'react'
import {createContext} from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const ShopContext=createContext()

const ShopContextProvider=(props)=>{
    const currency='Rs. ';
    const delivery_fee=10;
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch]=useState('')
    const [showSearch,setShowSearch]=useState(false)
    const [cartItems,setCartItems]=useState({})
    const [products,setProducts]=useState([])
    const [user,setUser]=useState(null);
    const navigate=useNavigate()

    const fetchCartData = async () => {
  try {
    const response = await axios.get(backendUrl + '/api/cart/get', { withCredentials: true });
    console.log("FETCHED CART FROM DB:", response.data);
    if (response.data.success) {
      setCartItems(response.data.cartData || {});
    }
  } catch (error) {
    console.error(error);
  }
};

    const fetchUser=async()=>{
        try {
            const response=await axios.get(backendUrl+'/api/user/getuser',{
                withCredentials:true
            })
            if(response.data.success){
                setUser(response.data.user)
                await fetchCartData()
            }else{
                setUser(null);
            }
        } catch (error) {
            setUser(null)
        }
    }

    

    useEffect(()=>{
        fetchUser()
        
    },[])

    const getCartCount=()=>{
        let totalCount=0
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalCount+=cartItems[items][item]
                    }
                }catch(error){
                    
                }
            }
        }
        return totalCount;
    }


    const getCartAmount=()=>{
        let totalAmount=0
        for(const items in cartItems){
            let itemInfo=products.find((products)=>products._id===items)
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalAmount+=itemInfo.price*cartItems[items][item]
                    }
                }catch(error){
                    
                }
            }
        }
        return totalAmount;
    }

    const getProductData=async()=>{
        try {
            const response=await axios.get(backendUrl+'/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        getProductData()
    },[])

    const loginUser=async(email,password)=>{
        try {
            const response=await axios.post(backendUrl+'/api/user/login',{
                email,
                password
            },{
                withCredentials:true
            })
            if(response.data.success){
                toast.success(response.data.message)
                await fetchUser()
                await fetchCartData();
                navigate('/')
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message||"Login failed")
        }
    }
    const registerUser=async(name,email,password)=>{
        try {
            const response=await axios.post(backendUrl+'/api/user/register',{
                name,
                email,
                password
            },{
                withCredentials:true
            })
            if(response.data.success){
                toast.success(response.data.message)
                await fetchUser()
                await fetchCartData();
                navigate('/')
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message||"Registration failed")
        }
    }

    const logoutUser = async () => {
    try {
        await axios.post(backendUrl + '/api/user/logout', {
            withCredentials: true
        });
        toast.success('Logged out successfully');
        setUser(null);
        navigate('/login');
    } catch (error) {
        console.error(error);
        toast.error('Logout failed');
    }
    };

    const addToCartDB = async (productId, size) => {
  try {
    const response = await axios.post(backendUrl + '/api/cart/add', {
      productId,
      size
    }, { withCredentials: true });

    if (response.data.success) {
      toast.success('Added to cart');
      await fetchCartData();  // optional: refresh local cart
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Add to cart failed');
  }
};

const addToCart = async (itemId, size) => {
  if (!size) {
    toast.error('Select Product Size');
    return;
  }

  // Update local cart
  let cartData = structuredClone(cartItems);
  if (cartData[itemId]) {
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
  } else {
    cartData[itemId] = { [size]: 1 };
  }
  setCartItems(cartData);

  // ✅ Also update DB
  await addToCartDB(itemId, size);
};

const updateCartDB = async (productId, size, quantity) => {
  try {
    const response = await axios.post(backendUrl + '/api/cart/update', {
      productId,
      size,
      quantity
    }, { withCredentials: true });

    if (response.data.success) {
      await fetchCartData();  // optional: refresh local cart
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Update failed');
  }
};

const updateQuantity = async (itemId, size, quantity) => {
  let cartData = structuredClone(cartItems);

  if (!cartData[itemId]) {
    cartData[itemId] = {};
  }

  if (quantity <= 0) {
    delete cartData[itemId][size];
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId];
    }
  } else {
    cartData[itemId][size] = quantity;
  }

  setCartItems(cartData);
  await updateCartDB(itemId, size, quantity);  // ✅ persist to DB
};

const getUserOrders = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/order/orders`, {
      withCredentials: true
    });

    if (response.data.success) {
      return response.data.orders;
    } else {
      toast.error("Failed to fetch orders");
      return [];
    }
  } catch (error) {
    toast.error("Could not load orders");
    return [];
  }
};

const getAllOrders = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/order/admin/allorders`, {
      withCredentials: true, 
    });
    return response.data.orders;
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return [];
  }
};

const addReview = async (productId, rating, comment) => {
  try {
    const res = await axios.post(`${backendUrl}/api/review/add`, {
      productId,
      rating,
      comment
    }, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Review error", err);
    return null;
  }
};

const getProductReviews = async (productId) => {
  try {
    const res = await axios.get(`${backendUrl}/api/review/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Fetch reviews error", err);
    return [];
  }
};



    const value={
        products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendUrl,loginUser,registerUser,user,fetchUser,setUser,logoutUser,addToCartDB,updateCartDB,fetchCartData,getUserOrders,getAllOrders,addReview,getProductReviews
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;