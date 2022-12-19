const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {signUpValidator, loginValidator} = require("../validators/auth");

const router = express.Router();

/**
 * @method - POST
 * @param - /auth/signup
 * @description - User SignUp
 */
router.post("/signup", signUpValidator, AuthController.signUp);

 /**
 * @method - POST
 * @param - /auth/login
 * @description - User login
 */
router.post("/login", loginValidator, AuthController.login);

 /**
 * @method - POST
 * @param - /auth/forget-password
 * @description - Send email with password reset link to user 
 */
router.post("/forget-password", AuthController.forgetPassword);

 /**
 * @method - POST
 * @param - /auth/reset
 * @description - Reset password
 */
router.post("/reset", authMiddleware, AuthController.resetPassword);


module.exports = router;
