import express from "express";
import {
  getAdminStats,
  getAllCourses,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  updateUserStatus,
  getInstructorRequests,
  approveInstructorRequest,
  rejectInstructorRequest,
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

// Instructor Request moderation routes
adminRoute
  .route("/admin/instructor-requests")
  .get(verifyToken, userAuthorize(["admin"]), getInstructorRequests);

adminRoute
  .route("/admin/instructor-requests/:id/approve")
  .patch(verifyToken, userAuthorize(["admin"]), approveInstructorRequest);

adminRoute
  .route("/admin/instructor-requests/:id/reject")
  .patch(verifyToken, userAuthorize(["admin"]), rejectInstructorRequest);

export default adminRoute;
