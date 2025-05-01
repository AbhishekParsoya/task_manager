import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request , res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) { 
    res.status(401).json({ message: 'Missing token' })
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.authInfo = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;