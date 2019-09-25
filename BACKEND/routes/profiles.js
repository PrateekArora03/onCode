const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Auth = require("../auth/index");

router.use(Auth.verifyToken);

//Follow user
router.post("/:username/follow", (req, res, next) => {
  let username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ status: "success", message: "user not found" });
    }
    if (Object.is(req.userid, user.id)) {
      return res
        .status(401)
        .json({ status: "success", message: "Not able to follow youself" });
    }
    if (user.follower.includes(req.userid)) {
      return res
        .status(401)
        .json({ status: "success", message: "Already Follow" });
    }
    user.follower.push(req.userid);
    user.save((err, followeruser) => {
      if (err) return next(err);
      User.findByIdAndUpdate(
        req.userid,
        {
          $push: { following: followeruser.id }
        },
        { new: true },
        (err, followingUser) => {
          if (err) return next(err);
          res.status(201).json({
            status: "success",
            message: "follower updated",
            followeruser,
            followingUser
          });
        }
      );
    });
  });
});

//Unfollow user
router.delete("/:username/follow", (req, res, next) => {
  let username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ status: "success", message: "user not found" });
    }
    if (Object.is(req.userid, user.id)) {
      return res
        .status(401)
        .json({ status: "success", message: "Not able to unfollow youself" });
    }
    if (!user.follower.includes(req.userid)) {
      return res
        .status(401)
        .json({ status: "success", message: "not follow user" });
    }
    User.findByIdAndUpdate(
      user.id,
      { $pull: { follower: req.userid } },
      { new: true },
      (err, followeruser) => {
        if (err) return next(err);
        User.findByIdAndUpdate(
          req.userid,
          {
            $pull: { following: followeruser.id }
          },
          { new: true },
          (err, followingUser) => {
            if (err) return next(err);
            res.status(201).json({
              status: "success",
              message: "unfollow updated",
              followeruser,
              followingUser
            });
          }
        );
      }
    );
  });
});

module.exports = router;
