import type { Request, Response } from "express";
import Course from "../models/Course.js";

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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not found",
      });
    }

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
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });

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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not found",
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
