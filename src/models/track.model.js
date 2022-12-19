const mongoose = require("mongoose");
const { Schema } = mongoose;

const TrackSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  position: {
    type: Number,
    require: true
  },
  video_url: {
    type: String,
    default: 'https://www.youtube.com/watch?v=EqzUcMzfV1w&t=3402s'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],
  duration: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course'
  }
})

const TrackModel = mongoose.model("track", TrackSchema);

module.exports = {
  TrackModel
}