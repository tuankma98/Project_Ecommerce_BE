const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth.middleware");
const UserModel = require("../models/user.model");
const sessionModel = require("../models/session.model");

class SessionController {
  async addSession(req, res) {
    const { is_active, email, session_id, end_time } = req.body;

    try {
        // Tao ra 1 document Session =>> Bang Session se co them 1 document
        // Document no se chua ten cua user vua log vao
        // Co duoc ten - email ( ten nay la unique ), lien ket voi bang user de biet ai la ng vua log

        let log;
          log = new sessionModel({
            is_active, 
            email, 
            session_id, 
            end_time
          });
          await log.save();

          const user = await UserModel.findOne().or([{ email }]);
          user.sessions.push(log.id);
          await user.save();

      return res.status(200).json({
        log
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        msg: "Session error",
      });
    }
  }

  async getAllSession(req, res) {
    try {
        const data = await sessionModel.find({});

        res.status(200).json({
            data
        })
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get All Session",
      });
    }
  }
}

module.exports = new SessionController();
