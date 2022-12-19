const express = require("express");
const BlogController = require("../controllers/blog.controller");
const { authMiddleware }= require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", BlogController.getAllBlogs);
router.post("/", authMiddleware, BlogController.create);
router.get("/:slug", BlogController.getBlogBySlug);
router.patch("/:slug", authMiddleware, BlogController.edit);
router.delete("/:slug", authMiddleware, BlogController.delete);

module.exports = router;
