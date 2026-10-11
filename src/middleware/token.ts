import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userID: string, userEmail: string): string => {
  const userDatas = {
    userID,
    userEmail,
  };

  const token = jwt.sign(userDatas, process.env.JWT_SECRET_KEY!, {
    expiresIn: "30m",
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
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
