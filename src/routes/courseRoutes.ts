import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  getInstructorCourses,
  getInstructorStats,
  getSingleCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { userAuthorize, verifyToken } from "../middleware/token.js";

const courseRoute = express.Router();

// Public routes
courseRoute.route("/courses").get(getCourses);
courseRoute.route("/courses/:id").get(getSingleCourse);

// Instructor/admin routes
courseRoute
  .route("/courses")
  .post(verifyToken, userAuthorize(["instructor", "admin"]), createCourse);

courseRoute
  .route("/courses/:id")
  .put(verifyToken, userAuthorize(["instructor", "admin"]), updateCourse)
  .delete(verifyToken, userAuthorize(["instructor", "admin"]), deleteCourse);

// Instructor dashboard routes
courseRoute
  .route("/instructor/courses")
  .get(
    verifyToken,
    userAuthorize(["instructor", "admin"]),
    getInstructorCourses,
  );

courseRoute
  .route("/instructor/stats")
  .get(verifyToken, userAuthorize(["instructor", "admin"]), getInstructorStats);

export default courseRoute;
