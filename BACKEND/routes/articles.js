const express = require("express");
const router = express.Router();
const Article = require("../model/article");
const Comment = require("../model/comment");
const Tag = require("../model/tag");
const User = require("../model/user");
const Auth = require("../auth/index");

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

router.use(Auth.verifyToken);

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

            // option
            var newArticle = new Article();
            newArticle.title = "mdfhngfngnh";
            newArticle.save(err, created);

            createdPost.tags.push();
            createdPost.save();
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
      Article.findByIdAndUpdate(id, req.body, (err, updatedPost) => {
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
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    if (article.userid == req.userid) {
      Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if (err) return next(err);
        Comment.deleteMany({ post: id }, (err, deletedComment) => {
          if (err) return next(err);
          res.status(200).json({ status: "success", message: "post deleted" });
        });
      });
    } else {
      res.status(401).json({ status: "fail", message: "Not authorised!" });
    }
  });
});

//Favorite Article
router.get("/:articleId/favorite", (req, res, next) => {
  let articleId = req.params.articleId;
  User.findById(req.userid, (err, user) => {
    if (err) return next(err);
    if (!user.favourites.includes(articleId)) {
      user.favourites.push(articleId);
      user.save((err, updateduser) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(
          articleId,
          { $inc: { favouritecount: 1 } },
          { new: true },
          (err, updatedPost) => {
            if (err) return next(err);
            res.status(201).json({
              status: "success",
              message: "favourite added",
              post: updatedPost,
              user: updateduser
            });
          }
        );
      });
    } else {
      User.findByIdAndUpdate(
        req.userid,
        { $pull: { favourites: articleId } },
        { new: true },
        (err, updateduser) => {
          if (err) return next(err);
          Article.findByIdAndUpdate(
            articleId,
            { $inc: { favouritecount: -1 } },
            { new: true },
            (err, updatedPost) => {
              if (err) return next(err);
              res.status(201).json({
                status: "success",
                message: "favourite removed",
                post: updatedPost,
                user: updateduser
              });
            }
          );
        }
      );
    }
  });
});

module.exports = router;
