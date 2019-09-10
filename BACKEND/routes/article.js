const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");
const auth = require("../auth/index");

//show single post
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});
router.use(auth.verifyToken);
// create post
router.post("/new", (req, res, next) => {
  req.body.userid = req.userid;
  Article.create(req.body, (err, post) => {
    if (err) return next(err);
    res.json({ status: "sucess", message: "post added", post });
  });
});

//update routes
router.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, post) => {
    if (err) return next(err);
    if (post.userid == req.userid) {
      Article.findOneAndUpdate(id, req.body, (err, updatedPost) => {
        if (err) return next(err);
        res.json({ status: "sucess", message: "post updated" });
      });
    } else {
      res.status(401).json({ status: "fail", message: "Not authorised!" });
    }
  });
});
//delete Article and comments
router.delete("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findOneAndDelete(id, (err, msg) => {
    if (err) return next(err);
    Comment.deleteMany({ post: id }, (err, message) => {
      if (err) return next(err);
      res.json({ status: "sucess", message: "post deleted" });
    });
  });
});

module.exports = router;
