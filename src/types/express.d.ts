declare global {
  namespace Express {
    interface Request {
      user?: {
        userID: string;
        userEmail: string;
      };
    }
  }
}

export {};
