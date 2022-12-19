const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth.middleware");
const UserModel = require("../models/user.model");

class AdminController {
  async createTeacher(req, res) {
    const { username, email, password } = req.body;

    try {
      let teacher = await
        UserModel
          .findOne()
          .or([
            { username },
            { email },
          ])

      if (teacher) {
        res.status(500).json({
          msg: "Teacher already exist"
        })
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      teacher = new UserModel({
        username,
        email,
        password: hashPassword,
        role: "teacher"
      });
      await teacher.save();

      return res.status(200).json(teacher);

    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        msg: "Error when create new teacher account"
      })
    }
  }

  async getTeacher(req, res) {
    try {
      const teachers = await UserModel.find({
        role: 'teacher'
      })

      res.status(200).json(teachers || []);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get All Teachers"
      });
    }
  }

  async getTeacherByUsername(req, res) {
    const { username } = req.params;

    try {
      const teacher = await UserModel.findOne({ username });
      res.status(200).json(teacher || {
        msg: "Don't exist teacher with this username"
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error when get teacher by username"
      })
    }
  }

  async editTeacher(req, res) {
    const { username } = req.params;
    const newTeacherData = req.body;

    console.log(username)

    try {
      const teacher = await UserModel.findOneAndUpdate({ username }, newTeacherData, {
        returnOriginal: false
      })

      res.status(200).json(teacher);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error when edit teacher"
      })
    }
  }

  async deleteTeacherByUsername(req, res) {
    const { username } = req.params;
    try {
      const teacher = await UserModel.findOneAndDelete({ username });

      res.status(200).json(teacher);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error when delete teacher"
      })
    }
  }
}

module.exports = new AdminController;