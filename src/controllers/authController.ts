import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
        message: "Invallied cridential",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invallied cridential",
      });
    }

    const { password: removePassword, ...userData } = user.toObject();

    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getProfile = (req: Request, res: Response) => {};
export const logout = (req: Request, res: Response) => {};
