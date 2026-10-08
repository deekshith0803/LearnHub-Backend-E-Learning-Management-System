import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.route("/register").post(register);
authRoute.route("/login").post(login);
authRoute.route("/logout").post(logout);
authRoute.route("/profile").get(getProfile);

export default authRoute;
