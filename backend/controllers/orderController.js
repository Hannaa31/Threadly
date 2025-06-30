import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// PLACE NEW ORDER
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // ✅ assuming this is set by auth middleware
    const {
      deliveryDetails,
      subtotal,
      shipping,
      total,
      payment,
    } = req.body;

    // Get cart from DB (or from client if already sent, but DB is safer)
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    if (!Object.keys(cart).length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = [];

    for (const productId in cart) {
      const product = await productModel.findById(productId);
      if (!product) continue;

      const sizeQtyMap=cart[productId]
      for(const size in sizeQtyMap){
        const quantity=sizeQtyMap[size]

        orderItems.push({
        productId,
        itemData: {
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: quantity,
          size: size,
          },
        });
      }
    }

    const order = new orderModel({
      userId,
      items: orderItems,
      subtotal,
      shipping,
      total,
      payment,
      deliveryDetails,
    });

    await order.save();

    // Clear user's cart
    user.cartData = {};
    await user.save();

    res.status(201).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    console.log("Admin is requesting all orders");
    const orders = await orderModel.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


