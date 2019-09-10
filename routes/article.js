const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");

// create post
router.post("/new", (req, res, next) => {
  Article.create(req.body, (err, post) => {
    if (err) return next(err);
    post.user = req.body.userid;
    post.save();
    res.json({ status: "sucess", message: "post added", post });
  });
});

//update routes
router.post("/:id/update", (req, res, next) => {
  let id = req.params.id;
  Article.findOneAndUpdate(id, req.body, (err, updatedPost) => {
    if (err) return next(err);
    res.json({ status: "sucess", message: "post updated" });
  });
});
//delete Article and comments
router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Article.findOneAndDelete(id, (err, msg) => {
    if (err) return next(err);
    Comment.deleteMany({ post: id }, (err, message) => {
      if (err) return next(err);
      res.json({ status: "sucess", message: "post deleted" });
    });
  });
});

//show single post
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
