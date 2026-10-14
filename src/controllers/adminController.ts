import type { Request, Response } from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import mongoose from "mongoose";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalCourses, totalLessons, totalEnrollments] =
      await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Lesson.countDocuments(),
        Enrollment.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalLessons,
        totalEnrollments,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password",
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

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
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (typeof id !== "string" || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = !user.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .select("-__v");

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
