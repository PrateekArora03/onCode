const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: String, required: true, minlength: 3 },
  // photo: { type: String, required: true },
  post: [{ type: Schema.Types.ObjectId, ref: "article" }]
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
