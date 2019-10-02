const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 10 },
    description: { type: String, required: true, minlength: 10 },
    post: { type: String, required: true, minlength: 10 },
    userid: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    tags: { type: [Schema.Types.ObjectId], ref: "Tags" },
    comment: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    views: { type: Number, default: 0 },
    favouritecount: { type: Number, default: 0 },
    slug: { type: String, unique: true }
  },
  { timestamps: true }
);

articleSchema.pre("save", function(next) {
  this.slug = this.title
    .toLowerCase()
    .split(" ")
    .join("-");
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
