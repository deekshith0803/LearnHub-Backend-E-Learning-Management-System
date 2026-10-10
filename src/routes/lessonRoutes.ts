import express from "express";
import {
  addLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";
import { verifyToken } from "../middleware/token.js";

const lessonRoute = express.Router();

// Public route
lessonRoute.route("/courses/:id/lessons").get(getLessons);

// Protected route
lessonRoute.route("/courses/:id/lessons").post(verifyToken, addLesson);

// Protected lesson management
lessonRoute
  .route("/lessons/:id")
  .put(verifyToken, updateLesson)
  .delete(verifyToken, deleteLesson);

export default lessonRoute;
