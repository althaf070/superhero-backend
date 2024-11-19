import jwt from 'jsonwebtoken';
export const generateAndSetHeroCookies = (res, userId) => {
    try {
      const herotoken = jwt.sign({ userId },process.env.JWT_SECRET,{ expiresIn: '7d' });
  
      res.cookie('herotoken', herotoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:"None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return herotoken; 
    } catch (error) {
      console.error('Error generating token or setting cookie:', error);
      throw new Error('Could not set authentication cookie.');
    }
  };