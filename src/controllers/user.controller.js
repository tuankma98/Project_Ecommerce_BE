const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth.middleware");
const UserModel = require("../models/user.model");

class UserController {
  async getAllUser(req, res) {
    try {
      const user = await UserModel
        .find({ role: "user"})
        .populate('blogs')
        .populate('comments')
        .exec(function (err, user) {
          if (err) throw Error('Error When Populate For User');
          res.json(user);
        });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        msg: "Error when get all user"
      })
    }
  }
  /**
   * @method - POST
   * @description - Get LoggedIn User
   * @param - /user/me
   */
  async me(req, res) {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const { username, email } = req.user;
      const user = await UserModel
        .findOne()
        .or([{ username }, { email }])
        .populate('blogs')
        .populate('comments')
        .exec(function (err, user) {
          if (err) throw Error('Error When Populate For User');
          res.json(user);
        });
    } catch (err) {
      console.error(err.message);
      res.send({ message: "Error in Fetching user" });
    }
  }

  /**
   * @method - PATCH
   * @description - Update user info
   * @param - /user/settings
   */
  async update(req, res) {
    const { username, email } = req.user;
    const newUserData = req.body;

    if (username) {
      const user = await UserModel.findOneAndUpdate({ username }, newUserData, {
        returnOriginal: false
      })

      res.status(200).json(user)
    } else {
      const user = await UserModel.findOneAndUpdate({ email }, newUserData, {
        returnOriginal: false
      })

      res.status(200).json(user)
    }
  }
}

module.exports = new UserController;