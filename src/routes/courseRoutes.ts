import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { verifyToken } from "../middleware/token.js";

const courseRoute = express.Router();

// Public routes
courseRoute.route("/courses").get(getCourses);
courseRoute.route("/courses/:id").get(getSingleCourse);

// Protected routes
courseRoute.route("/courses").post(verifyToken, createCourse);

courseRoute
  .route("/courses/:id")
  .put(verifyToken, updateCourse)
  .delete(verifyToken, deleteCourse);

export default courseRoute;
