import express from "express";
import { userAuthorize, verifyToken } from "../middleware/token.js";
import {
  getProgress,
  updateProgress,
} from "../controllers/progressController.js";

const progressRoute = express.Router();

progressRoute
  .route("/courses/:id/progress")
  .put(verifyToken, userAuthorize(["student"]), updateProgress)
  .get(verifyToken, userAuthorize(["student"]), getProgress);

export default progressRoute;
