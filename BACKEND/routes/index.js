const express = require("express");
const router = express.Router();
const Article = require("../model/Article");

router.get("/", (req, res, err) => {
  Article.find({})
    .populate("userid", "-password")
    .limit(7)
    .exec((err, post) => {
      if (err) return next(err);
      res.status(200).json(post);
    });
});

module.exports = router;
