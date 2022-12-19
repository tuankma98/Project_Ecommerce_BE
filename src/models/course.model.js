const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    require: true
  },
  featured_image: String,
  description: String,
  video_url: {
    type: String,
    default: 'https://www.youtube.com/watch?v=EqzUcMzfV1w&t=3402s'
  },
  level: {
    type: String,
    default: 'Basic' 
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'track'
    }
  ],
  created_by: {
    type: String,
    default: 'admin'
  }
})

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = {
  CourseModel
}