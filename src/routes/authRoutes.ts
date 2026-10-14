import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/token.js";

const authRoute = express.Router();

// Public routes
authRoute.route("/register").post(register);
authRoute.route("/login").post(login);

// Protected routes
authRoute.route("/logout").post(verifyToken, logout);
authRoute.route("/profile").get(verifyToken, getProfile);

export default authRoute;
