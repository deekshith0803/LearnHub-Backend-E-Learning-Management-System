import express from "express";
import {
  addLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";
import { userAuthorize, verifyToken } from "../middleware/token.js";

const lessonRoute = express.Router();

// Public route
lessonRoute.route("/courses/:id/lessons").get(getLessons);

// Instructor/admin route
lessonRoute
  .route("/courses/:id/lessons")
  .post(verifyToken, userAuthorize(["instructor", "admin"]), addLesson);

lessonRoute
  .route("/lessons/:id")
  .put(verifyToken, userAuthorize(["instructor", "admin"]), updateLesson)
  .delete(verifyToken, userAuthorize(["instructor", "admin"]), deleteLesson);

export default lessonRoute;
