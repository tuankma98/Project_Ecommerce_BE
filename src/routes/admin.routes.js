const bcrypt = require("bcryptjs");
const express = require("express");
const AdminController = require("../controllers/admin.controller");
const AuthController = require("../controllers/auth.controller");
const CourseController = require("../controllers/course.controller");
const TrackController = require("../controllers/track.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { CourseModel, TrackModel } = require("../models/course.model");
const UserModel = require("../models/user.model");
const { loginValidator } = require("../validators/auth");
const router = express.Router();

router.post("/login", loginValidator, AuthController.login);

router.get("/teacher", authMiddleware, roleMiddleware, AdminController.getTeacher);
router.get("/teacher/:username", authMiddleware, roleMiddleware, AdminController.getTeacherByUsername);
router.post("/teacher", authMiddleware, roleMiddleware, AdminController.createTeacher);
router.patch("/teacher/:username", authMiddleware, roleMiddleware, AdminController.editTeacher);
router.delete("/teacher/:username", authMiddleware, roleMiddleware, AdminController.deleteTeacherByUsername);

/**
 * 
 */
router.get("/course", CourseController.getAllCourses);
router.get("/course/:slug", authMiddleware, CourseController.getCourseBySlug);
router.post("/course", authMiddleware, roleMiddleware, CourseController.create);
router.patch("/course/:slug", authMiddleware, roleMiddleware, CourseController.editCourseBySlug);
router.delete("/course/:slug", authMiddleware, roleMiddleware, CourseController.deleteCourseBySlug);

router.post("/course/:slug/track", authMiddleware, roleMiddleware, TrackController.create);
router.get("/course/:slug/track/:id", authMiddleware, TrackController.getTrackById);
router.patch("/course/:slug/track/:id", authMiddleware, TrackController.editTrackById);
router.delete("/course/:slug/track/:id", authMiddleware, TrackController.deleteTrackById);

module.exports = router;
