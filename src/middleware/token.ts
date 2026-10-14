import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (
  userID: string,
  userEmail: string,
  userRole: String,
): string => {
  const userDatas = {
    userID,
    userEmail,
    userRole,
  };

  const token = jwt.sign(userDatas, process.env.JWT_SECRET_KEY!, {
    expiresIn: "7d",
  });

  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies ?? {};

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found in cookies",
      });
    }

    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not configured");
    }

    const decoded = await jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userID !== "string" ||
      typeof decoded.userEmail !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      userID: decoded.userID,
      userEmail: decoded.userEmail,
      userRole: decoded.userRole,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const userAuthorize = (requiredRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!requiredRole.includes(req.user.userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    return next();
  };
};
