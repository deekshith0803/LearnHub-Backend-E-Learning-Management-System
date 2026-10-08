import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
} from "../controllers/courseController.js";

const courseRoute = express.Router();

courseRoute.route("/courses").post(createCourse).get(getCourses);
courseRoute
  .route("/courses/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export default courseRoute;
