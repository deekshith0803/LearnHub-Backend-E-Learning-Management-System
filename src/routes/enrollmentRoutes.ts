import express from "express";
import { verifyToken } from "../middleware/token.js";
import {
  enrollCourse,
  getMyCourses,
} from "../controllers/enrollmentController.js";

const enrollmentRoute = express.Router();

enrollmentRoute.route("/courses/:id/enroll").post(verifyToken, enrollCourse);
enrollmentRoute.route("/my-courses").get(verifyToken, getMyCourses);

export default enrollmentRoute;
