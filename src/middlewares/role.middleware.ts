import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.authInfo as { role: string };
    console.log("🚀 ~ role.middleware.ts:10 ~ return ~ user:", user)
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};

export default roleMiddleware;