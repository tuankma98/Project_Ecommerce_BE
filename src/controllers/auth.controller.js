const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user.model");
const { resetPasswordEmail } = require("../util/email");

class AuthController {
  /**
   * @method - POST
   * @param - /signup
   * @description /user/signup
   */
  async signUp(req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      // Only both unique username and email can signup
      let user = await UserModel.findOne().or([{ username }, { email }]);

      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user = new UserModel({
        username,
        email,
        password: hashPassword,
      });
      await user.save();

      const payload = {
        user: {
          username,
          email,
          role: user.role,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "7d",
        },
        async (err, token) => {
          if (err) throw err;
          await UserModel.findByIdAndUpdate(user.id, {
            token,
          });
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }

  /**
   * @method - POST
   * @param - /login
   * @description - /user/login
   */
  async login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await UserModel.findOne().or([{ username }, { email }]);

      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      await UserModel.findOneAndUpdate(
        { username },
        {
          logged_at: Date.now(),
        }
      );

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          username,
          email,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "7d",
        },
        async (err, token) => {
          if (err) throw err;
          await UserModel.findOne().or([{ username }, { email }]).update({ token });
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }

  async forgetPassword(req, res) {
    const { email } = req.body;


    try {
      let user = await UserModel.findOne({ email });

      if (!user)
        return res.status(400).json({
          message: `User With Email ${email} Not Exist`,
        });

      const payload = {
        user: {
          username: user.username,
          email,
          role: user.role,
        },
      };

      await jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "14d",
        },
        async (err, token) => {
          if (err) throw err;

          await UserModel.findOneAndUpdate({ email }, { token });

          let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          });

          let mailDetails = {
            from: process.env.MAIL_USER,
            to: email,
            subject: `Reset mật khẩu cho tài khoản PusherEdu với email ${email}`,
            html: resetPasswordEmail(email, token),
          };

          mailTransporter.sendMail(mailDetails, function (error, data) {
            if (error) {
              console.log("Error Occurs");
            } else {
              console.log(`Email sent successfully to ${email}`);
            }
          });

          res.status(200).json({
            msg: `Email sent successfully to ${email}`,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const { username, email } = req.user;
      const { newPassword } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      const user = await UserModel.findOneAndUpdate(
        { email },
        { password: hashPassword },
        { new: true }
      );

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.send({ message: "Error when change password" });
    }
  }
}

module.exports = new AuthController();
