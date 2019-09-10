const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");

// create post
router.post("/:id", (req, res, next) => {
  req.body.userid = req.userid;
  req.body.post = req.params.id;
  Comment.create(req.body, (err, post) => {
    if (err) return next(err);
    res.json({ status: "sucess", message: "Comment added" });
  });
});

//update routes
router.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (req.userid == comment.userid) {
      Comment.findOneAndUpdate(id, req.body, (err, updatedPost) => {
        if (err) return next(err);
        res.status(200).json({ status: "sucess", message: "Comment updated" });
      });
    } else res.status(401).json({ status: "fail", message: "Not authorised!" });
  });
});

//delete Article and comments
router.delete("/:id", (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (req.userid == comment.userid) {
      Comment.findOneAndDelete(id, (err, msg) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(msg.post, { $pull: { comments: id } });
      });
    } else res.status(401).json({ status: "fail", message: "Not authorised!" });
  });
});

module.exports = router;
