const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = mongoose.Schema({
  content: {
    type: String,
    require: true
  },
  scope: {
    type: String,
    enum: ["blog", "course", "track"],
    default: "blog",
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'blog',
    default: null
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    default: null
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: 'track',
    default: null
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true })

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = {
  CommentModel
}