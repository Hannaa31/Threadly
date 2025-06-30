import jwt from 'jsonwebtoken';

const requireAdminAuth = (req, res, next) => {
  const token = req.cookies.admintoken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied. Not an admin." });
    }

    req.admin = true; 
    next(); // pass control to the next middleware or route
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export default requireAdminAuth;
