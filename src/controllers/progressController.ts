import type { Request, Response } from "express";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import mongoose from "mongoose";

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const lessonId = req.body?.lessonId;
    const studentId = req.user?.userID;

    // console.log("Content-Type:", req.headers["content-type"]);
    // console.log("Request body:", req.body);

    // console.log("Course ID:", courseId);
    // console.log("Lesson ID:", lessonId);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID or lesson ID",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = await Lesson.findOne({
      _id: lessonId,
      course: courseId,
    });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found in this course",
      });
    }
    const totalLessons = await Lesson.countDocuments({
      course: courseId,
    });
    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: "This course has no lessons",
      });
    }

    let progress = await Progress.findOne({
      student: studentId,
      course: courseId,
    });

    if (!progress) {
      progress = new Progress({
        student: studentId,
        course: courseId,
        completedLessons: [],
        percentage: 0,
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (completedLesson) => completedLesson.toString() === lessonId,
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(new mongoose.Types.ObjectId(lessonId));
    }

    progress.percentage = Math.round(
      (progress.completedLessons.length / totalLessons) * 100,
    );

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress,
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

export const getProgress = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const studentId = req.user?.userID;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!courseId || Array.isArray(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const progress = await Progress.findOne({
      student: studentId,
      course: courseId,
    })
      .populate("course")
      .populate("completedLessons");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress fetched successfully",
      progress,
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
