import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    // Decoding and verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.userId = decoded.userId;  
    console.log(req.userId);
    
    next();  

  } catch (error) {
    console.error("Error in verifying token:", error.message);  
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};
