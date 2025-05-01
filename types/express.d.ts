
import 'express';

declare module 'express-serve-static-core' {
    interface Request {
      authInfo?: {
        userId: string;
        role?: string;
        // add other properties as needed
      };
      user?: {
        role: string;
        // Add other properties related to the user
      };
    }
  }