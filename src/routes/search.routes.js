const express = require("express");
const SearchController = require("../controllers/search.controller");
const { authMiddleware }= require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", SearchController.search);

module.exports = router;
