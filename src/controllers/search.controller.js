const { BlogModel } = require("../models/blog.model");
const { CourseModel } = require("../models/course.model");

class SearchController {
  async search(req, res) {
    const q = req.query.q;

    try {
      let course = await CourseModel.find({title: new RegExp(q, 'i')}).lean();
      let blog = await BlogModel.find({title: new RegExp(q, 'i')}).lean();

      return res.status(200).json({
        course,
        blog
      })

    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        msg: "Error when search"
      })
    }
  }    
}

module.exports = new SearchController();