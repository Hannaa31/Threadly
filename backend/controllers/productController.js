import {v2 as cloudinary, v2} from 'cloudinary';
import productModel from "../models/productModel.js"

//function for add product
const addProduct=async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}=req.body
        
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid sizes format" });
        }

        if(!name||!description||!price||!category||!subCategory||!Array.isArray(parsedSizes) || parsedSizes.length === 0){
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const image1=req.files.image1&&req.files.image1[0]
        const image2=req.files.image2&&req.files.image2[0]
        const image3=req.files.image3&&req.files.image3[0]
        const image4=req.files.image4&&req.files.image4[0]

        const isValidImage=(file)=>
        file&&['image/jpeg','image/png','image/jpg'].includes(file.mimetype)

        const images=[image1, image2, image3, image4].filter(isValidImage)
        if (images.length===0) {
            return res.status(400).json({success: false, message:"At least one valid image is required"});
        }
        let imagesUrl=await Promise.all(
            images.map(async (item)=>{
                try {
                    let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                    return result.secure_url;
                } catch (error) {
                    throw new Error(`Image upload failed: ${err.message}`);
                }
            })
        )
        const productData={
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller:bestseller==="true"?true:false,
            sizes:JSON.parse(sizes),
            image:imagesUrl,
            date: new Date()
        }
        const product=new productModel(productData)
        await product.save();
        res.status(201).json({success:true,message:"Product Added"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

//function for list products
const listProducts=async(req,res)=>{
    try {
        const products=await productModel.find({})
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

//function for removing product
const removeProduct=async(req,res)=>{
    try {
        const product=await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

//function for single product info
const singleProduct=async(req,res)=>{
    try {
        const {productId}=req.params
        const product=await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getRelatedProducts=async(req,res)=>{
    try {
        const {category,subCategory,exclude}=req.query
        const filter={
            category,
            subCategory,
            _id:{$ne:exclude},
        }
        const relatedProducts=await productModel.find(filter).limit(5)
        res.status(200).json(relatedProducts)
    } catch (error) {
        res.status(500).json({success:false,message:"Failed to fetch products",error})
    }
}

export {singleProduct,removeProduct,listProducts,addProduct,getRelatedProducts}