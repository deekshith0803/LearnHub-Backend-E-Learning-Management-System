import type { Request, Response } from "express";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      thumbnail,
      instructor,
      category,
      level,
      price,
      duration,
      requirements,
      whatYouWillLearn,
    } = req.body;

    if (
      !title ||
      !description ||
      !thumbnail ||
      !instructor ||
      !category ||
      !level ||
      !price ||
      !duration ||
      !requirements ||
      !whatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields",
      });
    }
    const course = await Course.create(req.body);

    res.status(200).json({
      success: true,
      message: "Course create successfully",
      course,
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
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();

    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "courses not find",
      });
    }
    res.status(200).json({
      success: true,
      courses,
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
export const getSingleCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not found",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "courses not find",
      });
    }

    res.status(200).json({
      success: true,
      course,
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
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not found",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const courseID = await Course.findById(id);

    if (!courseID) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      user.userRole !== "admin" &&
      courseID.instructor.toString() !== user.userID
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courses",
      });
    }

    const {
      title,
      description,
      thumbnail,
      category,
      level,
      price,
      duration,
      requirements,
      whatYouWillLearn,
      status,
    } = req.body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (category !== undefined) updates.category = category;
    if (level !== undefined) updates.level = level;
    if (price !== undefined) updates.price = price;
    if (duration !== undefined) updates.duration = duration;
    if (requirements !== undefined) updates.requirements = requirements;
    if (whatYouWillLearn !== undefined) {
      updates.whatYouWillLearn = whatYouWillLearn;
    }
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
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
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not found",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const courseID = await Course.findById(id);

    if (!courseID) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Admins can delete any course.
    // Instructors can delete only their own courses.
    if (
      user.userRole !== "admin" &&
      courseID.instructor.toString() !== user.userID
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own courses",
      });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "courses not find",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course delete successfully",
      course,
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
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user?.userID;

    if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    const courses = await Course.find({
      instructor: instructorId,
    });

    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "no products",
      });
    }

    res.status(200).json({
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
export const getInstructorStats = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user?.userID;

    if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    const course = await Course.find({ instructor: instructorId }).select(
      "_id",
    );

    const courseIds = course.map((course) => course._id);

    const [totalCourses, totalLessons, totalEnrollments] = await Promise.all([
      Promise.resolve(course.length),
      Lesson.countDocuments({ course: { $in: courseIds } }),
      Enrollment.countDocuments({ course: { $in: courseIds } }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalLessons,
        totalEnrollments,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
