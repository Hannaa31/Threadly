import userModel from "../models/userModel.js"
import productModel from '../models/productModel.js';


//add products to userCart
const addToCart=async(req,res)=>{
    try {
    const { productId, size } = req.body;
    const userId = req.userId;

    if (!productId||!size) {
      return res.status(400).json({success: false, message: "Missing productId or size" });
    }

    const user=await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart=user.cartData || {};
    if (!cart[productId]) cart[productId] = {};
    cart[productId][size]=(cart[productId][size] || 0) + 1;

    user.cartData = cart;
    user.markModified('cartData');
    await user.save();

    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
//update user cart
const updateCart=async(req,res)=>{
    try {
    const { productId, size, quantity } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    if (!cart[productId]) cart[productId] = {};

    if (quantity <= 0) {
      delete cart[productId][size];
      if (Object.keys(cart[productId]).length === 0) delete cart[productId];
    } else {
      cart[productId][size] = quantity;
    }

    user.cartData = cart;
    user.markModified('cartData')
    await user.save();

    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
//get user cart data
const getUserCart=async(req,res)=>{
    try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};

    res.status(200).json({ success: true, cartData: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export {addToCart,updateCart,getUserCart}