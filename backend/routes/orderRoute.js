import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import requireAdminAuth from "../middleware/requireAdminAuth.js";

const orderRouter = express.Router();

// Place an order
orderRouter.post("/placeorder",authUser, placeOrder);

// Get logged-in user's orders
orderRouter.get("/orders", authUser, getUserOrders);

// (Optional) Admin - Get all orders
orderRouter.get('/admin/allorders', requireAdminAuth, getAllOrders);

orderRouter.patch('/admin/update-status', requireAdminAuth, updateOrderStatus);


export default orderRouter;
