const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: String, required: true, minlength: 3, unique: true },
  // photo: { type: String, required: true },
  post: [{ type: Schema.Types.ObjectId, ref: "article" }]
});

tagSchema.pre("save", function(next) {
  this.name =
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
