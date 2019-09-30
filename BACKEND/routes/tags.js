const express = require("express");
const router = express.Router();
const Tag = require("../model/Tag");

router.get("/", (req, res, next) => {
  Tag.find({}, (err, tags) => {
    if (err) return next(err);
    res.status(200).json(tags);
  });
});
router.get("/popular", (req, res, next) => {
  Tag.find({}, (err, tags) => {
    if (err) return next(err);
    let popularTag = tags
      .sort((a, b) => {
        return b.post.length - a.post.length;
      })
      .slice(0, 15);
    res.status(200).json(popularTag);
  });
});

module.exports = router;
