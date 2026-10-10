import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userID: string, userEmail: string): string => {
  const userDatas = {
    userID,
    userEmail,
  };

  const token = jwt.sign(userDatas, process.env.JWT_SECRET_KEY!, {
    expiresIn: "5m",
  });

  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token fount in cookies",
      });
    }
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not configured");
    }

    await jwt.verify(token, secret);

    // const decoded = await jwt.verify(token, secret);
    // console.log("decoded-------->", decoded);

    next();
  } catch (error) {}
};
