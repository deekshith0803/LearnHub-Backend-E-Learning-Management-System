import type { Request, Response } from "express";
import Lesson from "../models/Lesson.js";
import mongoose from "mongoose";
import Course from "../models/Course.js";

export const addLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "No course found with this id",
      });
    }

    const { title, description, videoUrl, duration, order } = req.body;

    if (
      !title ||
      !description ||
      !videoUrl ||
      duration === undefined ||
      order === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = await Lesson.create({
      title,
      description,
      videoUrl,
      duration,
      order,
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
      message: "Something went wrong",
    });
  }
};
export const getLessons = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "No course found with this id",
    });
  }

  const lessons = await Lesson.find({
    course: id,
  }).sort({ order: 1 });

  if (lessons.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No lessons found for this course",
    });
  }

  return res.status(200).json({
    success: true,
    lessons,
  });
};
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "No course found with this id",
      });
    }

    const { title, description, videoUrl, duration, order } = req.body;

    if (
      !title ||
      !description ||
      !videoUrl ||
      duration === undefined ||
      order === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields",
      });
    }

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      {
        title,
        description,
        videoUrl,
        duration,
        order,
      },
      {
        new: true,
      },
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Lesson updated successfully",
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
