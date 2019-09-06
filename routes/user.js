const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.post("/registration", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.json({ status: "sucess", message: "user register" });
  });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (!user)
      return res
        .status(400)
        .json({ status: "failed", message: "user not found" });
  });
});

module.exports = router;
