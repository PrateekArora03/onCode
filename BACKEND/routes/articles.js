const express = require("express");
const router = express.Router();
const Article = require("../model/Article");
const Comment = require("../model/Comment");
const Tag = require("../model/Tag");
const User = require("../model/User");
const Auth = require("../auth/index");

//show single post
router.get("/:slug", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate(
    slug,
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
  let tags = req.body.tags ? req.body.tags.split(",") : [];
  let article = { ...req.body };
  article.tags = [];
  Article.create(article, (err, createdPost) => {
    if (err) return next(err);
    if (tags.length) {
      tags.forEach(tag => {
        tag = tag.toLowerCase().trim();
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

//update article
router.patch("/:slug", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne(slug, (err, post) => {
    if (err) return next(err);
    if (post.userid == req.userid) {
      Article.findByIdAndUpdate(post.id, req.body, (err, updatedPost) => {
        if (err) return next(err);
        res.status(200).json({ status: "success", message: "post updated" });
      });
    } else {
      res.status(401).json({ status: "fail", message: "Not authorised!" });
    }
  });
});
//delete Article and comments
router.delete("/:slug", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne(slug, (err, article) => {
    if (err) return next(err);
    if (article.userid == req.userid) {
      Article.findByIdAndDelete(article.id, (err, deletedArticle) => {
        if (err) return next(err);
        Comment.deleteMany({ post: article.id }, (err, deletedComment) => {
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
router.get("/:slug/favorite", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne(slug, (err, article) => {
    let articleId = article.id;
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
});

module.exports = router;
