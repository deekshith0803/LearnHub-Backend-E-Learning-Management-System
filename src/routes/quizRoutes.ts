import express from "express";
import { userAuthorize, verifyToken } from "../middleware/token.js";
import {
  createQuiz,
  getQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const quizRoute = express.Router();

// Instructor/admin: create a quiz
quizRoute
  .route("/courses/:id/quiz")
  .post(verifyToken, userAuthorize(["instructor", "admin"]), createQuiz);

// Authenticated users: retrieve quizzes
quizRoute.route("/courses/:id/quiz").get(verifyToken, getQuiz);

// Student: submit quiz answers
quizRoute
  .route("/quizzes/:id/submit")
  .post(verifyToken, userAuthorize(["student"]), submitQuiz);

export default quizRoute;
