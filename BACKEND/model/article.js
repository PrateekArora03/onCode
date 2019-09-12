const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 10 },
    post: { type: String, required: true, minlength: 10 },
    userid: { type: Schema.Types.ObjectId, required: true },
    tags: { type: [Schema.Types.ObjectId] },
    comment: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    views: { type: Number, default: 0 },
    favourites: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
