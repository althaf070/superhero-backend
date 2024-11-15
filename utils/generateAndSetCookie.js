import jwt from 'jsonwebtoken';

export const generateAndSetCookies = (res, userId) => {
    try {
      const token = jwt.sign({ userId },process.env.JWT_SECRET,{ expiresIn: '7d' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return token; // Optional, depending on if you need to return it
    } catch (error) {
      console.error('Error generating token or setting cookie:', error);
      throw new Error('Could not set authentication cookie.');
    }
  };