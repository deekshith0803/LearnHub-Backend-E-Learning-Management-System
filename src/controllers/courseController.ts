import type { Request, Response } from "express";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Quiz from "../models/Quiz.js";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user?.userID || req.body.instructor;

    if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(401).json({
        success: false,
        message: "Valid instructor authorization is required",
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

    // Field-by-field validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Course title is required and must be at least 3 characters long",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course description is required and must be at least 10 characters long",
      });
    }

    if (
      !thumbnail ||
      typeof thumbnail !== "string" ||
      thumbnail.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail image URL is required",
      });
    }

    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Course category is required",
      });
    }

    const validLevels = ["beginner", "intermediate", "advanced"];
    const normalizedLevel = (level || "beginner").toLowerCase();
    if (!validLevels.includes(normalizedLevel)) {
      return res.status(400).json({
        success: false,
        message: "Level must be beginner, intermediate, or advanced",
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number (0 or greater)",
      });
    }

    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number of hours",
      });
    }

    // Parse requirements
    let parsedRequirements: string[] = [];
    if (Array.isArray(requirements)) {
      parsedRequirements = requirements
        .map((r) => String(r).trim())
        .filter((r) => r.length > 0);
    } else if (typeof requirements === "string") {
      parsedRequirements = requirements
        .split(/[\n,]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    }

    // Parse whatYouWillLearn
    let parsedWhatYouWillLearn: string[] = [];
    if (Array.isArray(whatYouWillLearn)) {
      parsedWhatYouWillLearn = whatYouWillLearn
        .map((w) => String(w).trim())
        .filter((w) => w.length > 0);
    } else if (typeof whatYouWillLearn === "string") {
      parsedWhatYouWillLearn = whatYouWillLearn
        .split(/[\n,]/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      instructor: instructorId,
      category: category.trim(),
      level: normalizedLevel,
      price: parsedPrice,
      duration: parsedDuration,
      requirements: parsedRequirements,
      whatYouWillLearn: parsedWhatYouWillLearn,
      status: status !== undefined ? Boolean(status) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
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
      message: "Something went wrong while creating the course",
    });
  }
};
export const getCourses = async (req: Request, res: Response) => {
  try {
    const { search, category, level } = req.query;

    const query: Record<string, any> = {
      status: { $ne: false },
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    if (category && typeof category === "string" && category !== "All") {
      query.category = { $regex: category.trim(), $options: "i" };
    }


    if (level && typeof level === "string" && level !== "All") {
      query.level = { $regex: new RegExp(`^${level.trim()}$`, "i") };
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: courses.length,
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

    const courses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    });

    const courseIds = courses.map((course) => course._id);

    const [totalLessons, totalEnrollments, totalQuizzes] = await Promise.all([
      Lesson.countDocuments({ course: { $in: courseIds } }),
      Enrollment.countDocuments({ course: { $in: courseIds } }),
      Quiz.countDocuments({ course: { $in: courseIds } }),
    ]);

    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.status).length;
    const draftCourses = totalCourses - activeCourses;

    // Fetch details for top 5 recent courses
    const recentCourses = await Promise.all(
      courses.slice(0, 5).map(async (c) => {
        const [enrollments, lessonsCount, quizzesCount] = await Promise.all([
          Enrollment.countDocuments({ course: c._id }),
          Lesson.countDocuments({ course: c._id }),
          Quiz.countDocuments({ course: c._id }),
        ]);
        return {
          _id: c._id,
          title: c.title,
          category: c.category,
          price: c.price,
          status: c.status,
          level: c.level,
          thumbnail: c.thumbnail,
          createdAt: c.createdAt,
          enrollments,
          lessonsCount,
          quizzesCount,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        activeCourses,
        draftCourses,
        totalLessons,
        totalEnrollments,
        totalQuizzes,
        recentCourses,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
