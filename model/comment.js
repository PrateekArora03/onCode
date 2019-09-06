const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true, minlength: 3 },
    author: { type: Schema.Types.ObjectId, required: true },
    post: { type: Schema.Types.ObjectId, ref: "article" }
  },
  { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
