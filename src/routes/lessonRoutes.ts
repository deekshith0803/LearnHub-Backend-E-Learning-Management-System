import express from "express";
import {
  addLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";

const lessonRoute = express.Router();

lessonRoute.route("/courses/:id/lessons").post(addLesson).get(getLessons);
lessonRoute.route("/lessons/:id").put(updateLesson).delete(deleteLesson);

export default lessonRoute;
