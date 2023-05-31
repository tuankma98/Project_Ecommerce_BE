const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin", "teacher"],
    default: "user",
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    require: true
  },
  avatar: {
    type: String,
    default: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Round&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=UpDown&mouthType=Twinkle&skinColor=Pale'
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blog'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'session'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  bio: String,
  loggedInAt: Date,
  address: String,
  github_Url: String,
  facebook_Url: String,
  instagram_Url: String,
  twitter_Url: String,
  linkedIn_Url: String,
  youtube_Url: String,
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);