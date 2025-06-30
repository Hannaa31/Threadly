import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import router from './routes/reviewRoutes.js'

//App config
const app=express()
const port=process.env.PORT||4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors({
    origin: ['https://threadly-omega.vercel.app', 'https://threadly-fu4f.vercel.app'],
    credentials: true
}))
app.use(cookieParser())

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/review', router)

app.get('/',(req,res)=>{
    res.send("API Working")
})
app.listen(port,()=>console.log('Server started on PORT:'+port))