const express = require("express");
const { authMiddleware }= require("../middlewares/auth.middleware");

const UserController = require("../controllers/user.controller");

const router = express.Router();


router.get("/", UserController.getAllUser);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", authMiddleware, UserController.me);

/**
 * @method - PATCH
 * @description - Get LoggedIn User
 * @param - /user/settings
 */
 router.patch("/settings", authMiddleware, UserController.update);

module.exports = router;
