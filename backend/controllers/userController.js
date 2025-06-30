import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'}) //token expires in 1 day
}

//route for user login
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        //check if user exists
        const user=await userModel.findOne({email});
        //if user does not exist
        if(!user){
            return res.status(404).json({success:false,message:"User doesn't exist"})
        }
        //else matching password?
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=createToken(user._id)
            //token is stored in a secure cookie instead of being sent in the response body
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV==="production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            res.status(200).json({success:true,message:"Logged in successfully"})
        }else{
            res.status(401).json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

// route for user register
const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        //checking user already exists or not
        const exists=await userModel.findOne({email})
        if(exists){
            return res.status(409).json({success:false,message:"User already exists"})
        }
        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter a valid email"})
        }

        if(password.length<8){
            return res.status(400).json({success:false,message:"Please enter a strong password"})
        }
        
        //hashing user password
        //salt is a random value added to a password before hashing to make it more secure
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=new userModel({
            name,
            email,
            password:hashedPassword
        })
        const user=await newUser.save()
        const token=createToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(201).json({success:true,message:"Registered successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

// route for admin login
const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_HASHED_PASSWORD);
        if(email===process.env.ADMIN_EMAIL&&isMatch){
            const token=jwt.sign({id:"admin"},process.env.JWT_SECRET,{expiresIn:"1d"})
            //token is stored in a secure cookie instead of being sent in the response body
            res.cookie("admintoken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV==="production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            res.status(200).json({success:true,message:"Logged in as Admin successfully"})
        }else{
            res.status(400).json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error.message})
    }
}

const logoutUser=(req,res)=>{
    try {
        const token = req.cookies?.token;
        if (!token) {
            console.log("Logout attempted but no token was present.");
        }
        res.clearCookie("token",{
        httpOnly:true,
        sameSite:"Strict",
        secure:process.env.NODE_ENV==="production"
        })
        res.status(200).json({success:true,message:"Logged out successfully"})
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Logout failed" })
    }
}

export {logoutUser,loginUser,registerUser,adminLogin}