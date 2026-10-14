import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userID: string;
      userEmail: string;
      userRole: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
