const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true, minlength: 3 },
    userid: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    post: { type: Schema.Types.ObjectId, ref: "article" }
  },
  { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
