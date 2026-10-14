import express from "express";
import { userAuthorize, verifyToken } from "../middleware/token.js";
import {
  enrollCourse,
  getMyCourses,
} from "../controllers/enrollmentController.js";

const enrollmentRoute = express.Router();

enrollmentRoute
  .route("/courses/:id/enroll")
  .post(verifyToken, userAuthorize(["student"]), enrollCourse);

enrollmentRoute
  .route("/my-courses")
  .get(verifyToken, userAuthorize(["student"]), getMyCourses);

export default enrollmentRoute;
