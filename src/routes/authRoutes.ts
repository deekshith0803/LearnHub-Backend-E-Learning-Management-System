import express from "express";
import {
  getProfile,
  updateProfile,
  login,
  logout,
  register,
  requestInstructorRole,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/token.js";

const authRoute = express.Router();

// Public routes
authRoute.route("/register").post(register);
authRoute.route("/login").post(login);

// Protected routes
authRoute.route("/logout").post(verifyToken, logout);
authRoute.route("/profile").get(verifyToken, getProfile);
authRoute.route("/profile").put(verifyToken, updateProfile);
authRoute
  .route("/request-instructor")
  .post(verifyToken, requestInstructorRole);

export default authRoute;
