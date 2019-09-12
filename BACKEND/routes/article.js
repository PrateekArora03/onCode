const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");
const Tag = require("../model/tag");
const User = require("../model/user");
const auth = require("../auth/index");

//show single post
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true },
    (err, post) => {
      if (err) return next(err);
      res.status(200).json(post);
    }
  );
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
                  return res.status(201).json({
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
      res.status(201).json({
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
        res.status(200).json({ status: "success", message: "post updated" });
      });
    } else {
      res.status(401).json({ status: "fail", message: "Not authorised!" });
    }
  });
});
//delete Article and comments
router.delete("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findOneAndDelete(id, (err, deletedArticle) => {
    if (err) return next(err);
    Comment.deleteMany({ post: id }, (err, deletedComment) => {
      if (err) return next(err);
      res.status(200).json({ status: "success", message: "post deleted" });
    });
  });
});
//favourites
router.get("/:articleId/favourite", (req, res, next) => {
  const articleId = req.params.articleId;
  User.findByIdAndUpdate(
    req.userid,
    { $push: { favourites: articleId } },
    { upsert: true, new: true },
    (err, updatedUser) => {
      if (err) return next(err);
      Article.findByIdAndUpdate(
        articleId,
        { $inc: { favourites: 1 } },
        { new: true },
        (err, updatedPost) => {
          if (err) return next(err);
          res
            .status(201)
            .json({
              status: "success",
              message: "favoutite added",
              updatedPost
            });
        }
      );
    }
  );
});
module.exports = router;
