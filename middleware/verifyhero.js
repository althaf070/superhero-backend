import jwt from 'jsonwebtoken';

export const verifyHero = async (req, res, next) => {
  const herotoken = req.cookies.herotoken;

  if (!herotoken) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    // Decoding and verifying token
    const decoded = jwt.verify(herotoken, process.env.JWT_SECRET);
  
    req.heroId = decoded.heroId;  
    
    next();  

  } catch (error) {
    console.error("Error in verifying token:", error.message);  
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};
