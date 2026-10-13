import express from "express";
import { verifyToken } from "../middleware/token.js";
import {
  createQuiz,
  getQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const quizRoute = express.Router();

quizRoute
  .route("/courses/:id/quiz")
  .post(verifyToken, createQuiz)
  .get(verifyToken, getQuiz);

quizRoute.route("/quizzes/:id/submit").post(verifyToken, submitQuiz);

export default quizRoute;
