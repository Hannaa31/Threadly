import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId,ref: "user",required: true},
  items: [
  {
    productId: { type: String },
    itemData: {
      name: String,
      image: [String],
      price: Number,
      quantity: Number,
      size: String,
    },
  },
],
  subtotal: {type: Number,required: true},
  shipping: {type: Number,default: 0},
  total: {type: Number,required: true},
  payment: {type: String,enum: ["Stripe", "Cash on Delivery"],required: true},
  status: {type: String,enum: ["Processing", "Shipped", "Out for delivery", "Delivered"],default: "Processing"},

  deliveryDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    },}, { timestamps: true });

export default mongoose.model("orders", orderSchema);
