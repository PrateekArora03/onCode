const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");
const Tag = require("../model/tag");
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
  console.log(req.body);
  let tags = req.body.tags ? req.body.tags.split(",") : [];
  console.log(tags);
  let article = { ...req.body };
  article.tags = [];
  Article.create(article, (err, createdPost) => {
    if (err) return next(err);
    if (tags.length != 0) {
      tags.forEach(tag => {
        console.log("inside tags create");
        // tag = tag.trim()[0].toUpperCase() + tag.slice(1).toLowerCase();
        Tag.findOneAndUpdate(
          { name: tag },
          { $push: { post: createdPost.id } },
          { upsert: true, new: true },
          (err, tagData) => {
            if (err) return next(err);
            Article.findByIdAndUpdate(
              createdPost.id,
              { $push: { tags: tagData.id } },
              { new: true },
              (err, updatedPost) => {
                if (err) return next(err);
                if (tags.length === updatedPost.tags.length)
                  return res.json({
                    status: "success",
                    message: "post added",
                    updatedPost
                  });
              }
            );
          }
        );
      });
    } else {
      res.json({
        status: "success",
        message: "post added",
        createdPost
      });
    }
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
