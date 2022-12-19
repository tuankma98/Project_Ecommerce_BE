const { BlogModel } = require("../models/blog.model");
const UserModel = require("../models/user.model");

class BlogController {
  async getAllBlogs(req, res) {
    try {
      const blog = await 
      BlogModel.find({})
      .populate('created_by')
      .exec(function(err, blog) {
        if (err) throw Error('Error When Populate For Blog');
        return res.json({
          blog
        })
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get All Blog"
      });
    }
  }

  async getBlogBySlug(req, res) {
    const { slug }= req.params;
    try{
      const blog = await BlogModel 
      .findOne({ slug })
      .populate('created_by')
      .populate('comments')
      .exec(function(err, blog) {
        if (err) throw Error('Error When Populate For Blog');
        return res.json({
          blog 
        })
      });


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get Blog jBy Slug"
      });
    }
  }

  async create(req, res) {
    const { slug } = req.body;
    const { username, email } = req.user;

    try {
      // Check exist blog
      let blog = await BlogModel.findOne({slug});
      if (blog) {
        return res.status(400).json({
          msg: "Blog slug already exist"
        })
      }

      // Check user who created blog
      let user = await UserModel.findOne().or([{ username }, { email }]);
      
      blog = new BlogModel({
        ...req.body,
        created_by: user.id
      });
      await blog.save();

      user.blogs.push(blog.id);
      await user.save();

      res.status(200).json({
        blog
      })

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Create Blog"
      });
    }
  }

  async edit(req, res) {
    const { slug }= req.params;
    const newBlogData = req.body;

    try{
      const blog = await BlogModel 
      .findOneAndUpdate({ slug }, newBlogData, {
        returnOriginal: false
      })
      
      return res.json({
        blog 
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get Blog By Slug"
      });
    } 
  }

  async delete(req, res) {
    const { slug }= req.params;
    const { username, email } = req.user;

    try{
      const blog = await BlogModel.findOneAndDelete({ slug });

      // Check user who removed blog
      let user = await UserModel.findOne().or([{ username }, { email }]);

      const newBlogs = user.blogs.filter(
        (item) => item._id.toString() !== blog._id.toString()
      );

      user.blogs = newBlogs;
      await user.save();
      
      return res.json({
        blog 
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Delete blog By Slug"
      });
    } 
  }
}

module.exports = new BlogController();
