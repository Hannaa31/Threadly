
# 🧵 Threadly

Threadly is a **full-stack e-commerce web application** built with a **React + Vite frontend**, **Express + MongoDB backend**, and includes an **admin dashboard** for managing products and orders.  
It also integrates **Stripe** for secure online payments.

---

## 📂 Project Structure
```
Threadly/
├── admin/     # Admin panel (React + Vite)
├── backend/   # Express server, MongoDB, APIs
└── frontend/  # Customer-facing frontend (React + Vite)
```

---

## 🚀 Features

### ✨ Frontend (Customer Side)
✅ Built with **React + Vite**, styled with **Tailwind CSS**  
✅ Product listing, detail pages, related products  
✅ Shopping cart with size variants  
✅ Secure checkout with **Stripe** or **Cash on Delivery**  
✅ View & track orders  
✅ User authentication & profile  
✅ Review system with ratings

---

### 🔐 Admin Panel
✅ Separate **React app** with protected routes  
✅ Admin login with JWT cookies  
✅ Add, list, and remove products  
✅ Manage orders & update order statuses:  
   - Processing  
   - Shipped  
   - Out for delivery  
   - Delivered

---

### 🛠 Backend
✅ **Node.js**, **Express**, **MongoDB (Mongoose)**  
✅ Secure JWT auth for users & admin  
✅ APIs for products, cart, orders, payments, reviews  
✅ **Cloudinary** integration for image uploads  
✅ **Stripe** for payments  
✅ Robust middleware: auth checks, multer for file uploads

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Hannaa31/Threadly.git
cd Threadly
```

### 2️⃣ Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### Admin Panel
```bash
cd ../admin
npm install
```

---

## 🚀 Running the app locally

#### Backend
```bash
cd backend
npm run server
```
➡ Runs on: **http://localhost:4000**

#### Frontend
```bash
cd ../frontend
npm run dev
```
➡ Runs on: **http://localhost:5174**

#### Admin Panel
```bash
cd ../admin
npm run dev
```
➡ Runs on: **http://localhost:5173**

---

## 🔑 Environment variables

Create a `.env` file inside your `backend/` directory:

```ini
PORT=4000
MONGODB_URI=your_mongo_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_HASHED_PASSWORD=hashed_admin_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

💡 *For local testing of admin login, generate a hashed password using bcrypt.*

---

## 🖥 Deployment
✅ Configured with `vercel.json` for both **frontend** and **admin** for simple deployment on **Vercel**.  
✅ Ensure backend CORS origins allow your deployed frontend/admin URLs.

---

## 📝 Credits
- React, Vite, Tailwind CSS
- Node.js, Express, MongoDB
- Stripe for payments
- Cloudinary for image uploads

---
## 🧑‍💻 Developed by

**Sakshi**  
GitHub: [Hannaa31](https://github.com/Hannaa31)
Website: [Threadly](https://threadly-omega.vercel.app/)
