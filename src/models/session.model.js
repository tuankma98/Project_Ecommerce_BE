const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = mongoose.Schema({
  email: {
    type:String,
    required: true
  },
  session_id: {
    type: String,
    required: true
  },
  end_time: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

// export model session with sessionSchema
module.exports = mongoose.model("session", sessionSchema);
