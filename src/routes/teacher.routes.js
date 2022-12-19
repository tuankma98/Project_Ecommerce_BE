const express = require("express");
const { authMiddleware }= require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", authMiddleware, async (req, res) => {
  
  return res.status(200).json({
    msg: 'Done'
  })
});

module.exports = router;
