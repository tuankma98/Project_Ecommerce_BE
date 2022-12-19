const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = mongoose.Schema({
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
  content: {
    type: String,
    require: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ]
}, { timestamps: true })

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = {
  BlogModel
}