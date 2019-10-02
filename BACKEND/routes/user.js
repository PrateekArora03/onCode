const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Auth = require("../auth/index");

//Get Current User
router.get("/", Auth.verifyToken, (req, res, next) => {
  User.findById(req.userid, "-password", (err, currentUser) => {
    if (err) return res.status(301).json({ success: false, err });
    res.status(200).json(currentUser);
  });
});

//update user
router.put("/", Auth.verifyToken, (req, res, next) => {
  if (!req.body.email) delete req.body["email"];
  if (!req.body.password) delete req.body["password"];
  User.findByIdAndUpdate(req.userid, req.body, { new: true }, (err, user) => {
    if (err) return res.status(301).json({ success: false, err });
    if (req.body.password) {
      user.password = req.body.password;
      user.save((err, updateduser) => {
        if (err) return res.status(301).json({ success: false, err });
        return res
          .status(202)
          .json({ status: "sucess", message: "user updated", updateduser });
      });
    } else {
      return res
        .status(202)
        .json({ status: "sucess", message: "user updated", user });
    }
  });
});

module.exports = router;
