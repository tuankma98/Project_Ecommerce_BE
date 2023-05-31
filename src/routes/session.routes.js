const express = require("express");
const { authMiddleware }= require("../middlewares/auth.middleware");

const SessionController = require("../controllers/session.controller");

const router = express.Router();


router.get("/", SessionController.getAllSession);
router.patch("/", SessionController.addSession);

module.exports = router;