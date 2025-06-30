import express from 'express'
import {singleProduct,removeProduct,listProducts,addProduct, getRelatedProducts} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import requireAdminAuth from '../middleware/requireAdminAuth.js'

const productRouter=express.Router()

productRouter.post('/add',requireAdminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouter.post('/remove',requireAdminAuth,removeProduct)
productRouter.get('/single',singleProduct)
productRouter.get('/list',listProducts)
productRouter.get("/related",getRelatedProducts)

export default productRouter