import type { Request, Response } from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

interface AuthRequest extends Request {
  user?: {
    userID: string;
    userEmail: string;
  };
}

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userID = req.user?.userID;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id);

    if (!course || !course.status) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unavailable",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: userID,
      course: id,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: userID,
      course: id,
    });

    return res.status(201).json({
      success: true,
      message: "Course enrollment successful",
      enrollment,
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

export const getMyCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const enrollments = await Enrollment.find({
      student: userID,
    })
      .populate("course")
      .sort({ enrolledAt: -1 });

    return res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments,
    });
  } catch (error) {
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
