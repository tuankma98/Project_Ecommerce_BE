const { CourseModel } = require("../models/course.model");
const UserModel = require("../models/user.model");

class CourseController {
  async create(req, res) {
    const { slug } = req.body;
    const { username, email } = req.user;


    try {
      // Check exist course slug
      let course = await CourseModel.findOne({ slug });
      if (course) {
        return res.status(400).json({
          msg: "Course Slug Already Exist"
        })
      }

      let createdBy = 'admin';

      if (!username) {
        const teacher = await UserModel.findOne({ email });
        const usernameFromDb = teacher.username;

        createdBy = username === process.env.ADMIN_USERNAME ? 'admin' : usernameFromDb;
      } else {
        createdBy = username === process.env.ADMIN_USERNAME ? 'admin' : username;
      }

      course = new CourseModel({
        ...req.body,
        created_by: createdBy
      });
      await course.save();
  
      return res.json({
        course
      })
    } catch (err) {
      console.log(err.message)
      return res.status(500).json({
        msg: "Can Not Create New Course"
      })
    }
  }

  async getAllCourses(req, res) {
    try {
      const courses = await 
      CourseModel.find({})
      .populate('tracks')
      .populate('comments')
      .exec(function(err, course) {
        if (err) throw Error('Error When Populate Track For Course');

        return res.json({
          course
        })
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get All Courses"
      });
    }
  }

  async getCourseBySlug(req, res) {
    const { slug }= req.params;
    try{
      const course = await CourseModel
      .findOne({ slug })
      .populate('tracks')
      .populate('comments')
      .exec(function(err, course) {
        if (err) throw Error('Error When Populate Track For Course');

        return res.json({
          course
        })
      });


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get Course By Slug"
      });
    }
  }

  async editCourseBySlug(req, res) {
    const { slug }= req.params;
    const newCourseData = req.body;

    try{
      const course = await CourseModel
      .findOneAndUpdate({ slug }, newCourseData, {
        returnOriginal: false
      })
      
      return res.json({
        course
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get Course By Slug"
      });
    } 
  }

  async deleteCourseBySlug(req, res) {
    const { slug }= req.params;

    try{
      const course = await CourseModel.findOneAndDelete({ slug });
      
      return res.json({
        course
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Delete Course By Slug"
      });
    } 
  }
  
}

module.exports = new CourseController;