const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 4,
      maxlength: 15
    },
    name: { type: String, minlength: 4 },
    email: {
      type: String,
      minlength: 4,
      unique: true,
      required: true,
      lowercase: true
    },
    password: { type: String, minlength: 4 },
    photo: String,
    bio: { type: String, minlength: 30, maxlength: 200 },
    tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
    designation: String,
    favourites: [{ type: Schema.Types.ObjectId, ref: "article" }],
    follower: [{ type: Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    social: {
      website: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      github: { type: String },
      linkedin: { type: String }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.isValidatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
