const UserModel = require("../models/user.model");
const { BlogModel } = require("../models/blog.model");
const { CommentModel } = require("../models/comment.model");
const { CourseModel } = require("../models/course.model");
const { TrackModel } = require("../models/track.model");

class CommentController {
  async create(req, res) {
    const { slug } = req.params;
    const { username, email } = req.user;
    const { scope } = req.query || 'blog';

    console.log(scope);

    try {
      // Check user who created comment
      const user = await UserModel.findOne().or([{ username }, { email }]);
      let comment;

      if (scope === 'blog') {
        // Check blog 
        const blog = await BlogModel.findOne({ slug });

        comment = new CommentModel({
          ...req.body,
          created_by: user.id,
          blog: blog.id,
          scope: 'blog'
        });
        await comment.save();

        blog.comments.push(comment.id);
        await blog.save();
      } else if (scope === 'course') {
        // Check course
        const course = await CourseModel.findOne({ slug });

        comment = new CommentModel({
          ...req.body,
          created_by: user.id,
          course: course.id,
          scope: 'course'
        });
        await comment.save();

        course.comments.push(comment.id);
        await course.save();
      } else if (scope === 'track') {
        const trackId = req.query.trackId;

        // Check track
        const track = await TrackModel.findOne({ _id: trackId });
        comment = new CommentModel({
          ...req.body,
          created_by: user.id,
          track: track.id,
          scope: 'track'
        });
        await comment.save();

        track.comments.push(comment.id);
        await track.save();
      }

      user.comments.push(comment.id);
      await user.save();

      res.status(200).json({
        comment
      })
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error when create new comment"
      })
    }
  }

  async edit(req, res) {
    const { id } = req.params;
    const newCommentData = req.body;

    try {
      const comment = await CommentModel
        .findByIdAndUpdate(id, newCommentData, {
          returnOriginal: false
        })

      return res.json({
        comment
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Edit Comment By Id"
      });
    }
  }

  async delete(req, res) {
    const { slug, id } = req.params;
    const { username, email } = req.user;
    const { scope } = req.query || 'blog';

    try {
      const comment = await CommentModel.findByIdAndDelete(id);

      // Check user who created comment
      const user = await UserModel.findOne().or([{ username }, { email }]);
      const newUserComments = user.comments.filter(
        (item) => item._id.toString() !== comment._id.toString()
      );
      user.comments = newUserComments;
      await user.save();

      if (scope === 'blog') {
        // Check blog 
        const blog = await BlogModel.findOne({ slug });
        const newBlogComments = blog.comments.filter(
          (item) => item._id.toString() !== comment._id.toString()
        );
        blog.comments = newBlogComments;
        await blog.save();
      } else if (scope === 'course') {
        const course = await CourseModel.findOne({ slug });
        const newCourseComments = course.comments.filter(
          (item) => item._id.toString() !== comment._id.toString()
        );
        course.comments = newCourseComments;
        await course.save();
      } else if (scope === 'track') {
        const track = await TrackModel.findOne({ id: req.query.trackId });
        console.log(req.query.trackId)

        const newTrackComments = track.comments.filter(
          (item) => item._id.toString() !== comment._id.toString()
        );
        track.comments = newTrackComments;
        await track.save();
      }

      return res.json({
        comment
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Delete Track By Id"
      });
    }
  }
}

module.exports = new CommentController();