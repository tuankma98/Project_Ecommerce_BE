const express = require("express");
const CommentController = require("../controllers/comment.controller");
const { authMiddleware }= require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/:slug", authMiddleware, CommentController.create);
router.patch("/:id", authMiddleware, CommentController.edit);
router.delete("/:slug/:id", authMiddleware, CommentController.delete);

module.exports = router;
