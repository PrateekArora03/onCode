const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Auth = require("../auth/index");

//Get Current User
router.get("/", Auth.verifyToken, (req, res, next) => {
  User.findById(req.userid, "-password", (err, currentUser) => {
    if (err) return next(err);
    res.status(200).json(currentUser);
  });
});

//update user
router.put("/", Auth.verifyToken, (req, res, next) => {
  User.findOneAndUpdate(req.userid, req.body, { new: true }, (err, user) => {
    if (err) return next(err);
    user.password = req.body.password;
    user.save((err, updateduser) => {
      if (err) return next(err);
      res
        .status(401)
        .json({ status: "sucess", message: "user updated", updateduser });
    });
  });
});

module.exports = router;
