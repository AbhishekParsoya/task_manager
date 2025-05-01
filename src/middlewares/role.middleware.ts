import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: string };
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};

export default roleMiddleware;