const express = require("express");
const router = express.Router();
const Article = require("../model/article");

router.get("/", (req, res, err) => {
  Article.find({}, (err, post) => {
    if (err) return next(err);
    res.status(200).json(post);
  });
});

module.exports = router;
