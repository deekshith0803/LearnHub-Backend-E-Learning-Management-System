import type { Request, Response } from "express";
import Lesson from "../models/Lesson.js";
import mongoose from "mongoose";
import Course from "../models/Course.js";

export const addLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const { title, description, videoUrl, duration, order } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required and must be at least 3 characters",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Lesson description is required and must be at least 5 characters",
      });
    }

    if (!videoUrl || typeof videoUrl !== "string" || videoUrl.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lesson video URL is required",
      });
    }

    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Lesson duration must be a positive number of minutes",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify instructor ownership
    if (
      req.user?.userRole !== "admin" &&
      course.instructor.toString() !== req.user?.userID
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only add lessons to your own courses",
      });
    }

    const existingCount = await Lesson.countDocuments({ course: id });
    const parsedOrder =
      order !== undefined && !isNaN(Number(order))
        ? Number(order)
        : existingCount + 1;

    const lesson = await Lesson.create({
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      duration: parsedDuration,
      order: parsedOrder,
      course: new mongoose.Types.ObjectId(id),
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
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
      message: "Something went wrong while adding the lesson",
    });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const lessons = await Lesson.find({
      course: id,
    }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      lessons: lessons || [],
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const { title, description, videoUrl, duration, order } = req.body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Lesson title must be at least 3 characters",
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Lesson description must be at least 5 characters",
        });
      }
      updates.description = description.trim();
    }

    if (videoUrl !== undefined) {
      if (typeof videoUrl !== "string" || videoUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Lesson video URL is required",
        });
      }
      updates.videoUrl = videoUrl.trim();
    }

    if (duration !== undefined) {
      const numDuration = Number(duration);
      if (isNaN(numDuration) || numDuration <= 0) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a positive number of minutes",
        });
      }
      updates.duration = numDuration;
    }

    if (order !== undefined) {
      const numOrder = Number(order);
      if (isNaN(numOrder) || numOrder <= 0) {
        return res.status(400).json({
          success: false,
          message: "Order must be a positive number",
        });
      }
      updates.order = numOrder;
    }

    const lesson = await Lesson.findById(id).populate("course");
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const course = lesson.course as any;
    if (
      req.user?.userRole !== "admin" &&
      course?.instructor?.toString() !== req.user?.userID
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update lessons for your own courses",
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
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
      message: "Something went wrong while updating the lesson",
    });
  }
};
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID not found",
      });
    }

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      lesson,
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
