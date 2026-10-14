import express from "express";
import {
  getAdminStats,
  getAllCourses,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/adminController.js";
import { userAuthorize, verifyToken } from "../middleware/token.js";

const adminRoute = express.Router();

adminRoute
  .route("/admin/stats")
  .get(verifyToken, userAuthorize(["admin"]), getAdminStats);

adminRoute
  .route("/admin/users")
  .get(verifyToken, userAuthorize(["admin"]), getAllUsers);

adminRoute
  .route("/admin/courses")
  .get(verifyToken, userAuthorize(["admin"]), getAllCourses);

adminRoute
  .route("/admin/users/:id")
  .get(verifyToken, userAuthorize(["admin"]), getSingleUser);

adminRoute
  .route("/admin/users/:id/role")
  .patch(verifyToken, userAuthorize(["admin"]), updateUserRole);

adminRoute
  .route("/admin/users/:id/status")
  .patch(verifyToken, userAuthorize(["admin"]), updateUserStatus);

export default adminRoute;
