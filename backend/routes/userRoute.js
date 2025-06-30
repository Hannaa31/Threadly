import express from 'express'
import {logoutUser,loginUser,registerUser,adminLogin} from '../controllers/userController.js'
import authUser from '../middleware/auth.js';
import requireAdminAuth from '../middleware/requireAdminAuth.js';
import userModel from '../models/userModel.js';

const userRouter=express.Router()

//public routes
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

userRouter.get('/getuser', authUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


//logout route-clear token cookie
userRouter.post('/logout', logoutUser);

//protected route
userRouter.get('/profile', authUser, (req, res) => {
  res.status(200).json({success:true, message: "You are logged in!", userId: req.user });
});
userRouter.get('/admin/dashboard', requireAdminAuth, (req, res) => {
  res.json({ message: "Welcome, admin!", userId: req.user });
});
userRouter.get('/verify-admin', requireAdminAuth, (req, res) => {
  res.json({ success: true });
});
userRouter.get('/verify', authUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Token is valid' });
});


export default userRouter;