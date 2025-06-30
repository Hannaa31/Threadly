import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';

const authUser=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({success:false, message:"Not Authorized Login Again"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decoded.id
        next();
    } catch (error) {
        return res.status(403).json({success:false, message:"Inavalid or expired token"})
        }
}

export default authUser