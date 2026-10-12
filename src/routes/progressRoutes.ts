import express from "express";
import { verifyToken } from "../middleware/token.js";
import {
  getProgress,
  updateProgress,
} from "../controllers/progressController.js";

const progressRoute = express.Router();

progressRoute
  .route("/courses/:id/progress")
  .put(verifyToken, updateProgress)
  .get(verifyToken, getProgress);

export default progressRoute;
