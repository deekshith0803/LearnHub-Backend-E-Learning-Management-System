import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/token.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.create(req.body);

    const { password: removePassword, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "user registered successfully",
      user: userData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Inactive user",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    const { password: removePassword, ...userData } = user.toObject();

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user: userData,
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userID = req.user?.userID;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const logout = (req: Request, res: Response) => {
  try {
    return res.status(200).clearCookie("token").json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
