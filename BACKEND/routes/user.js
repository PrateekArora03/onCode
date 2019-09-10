const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Auth = require("../auth/index");

router.post("/registration", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.json({ status: "sucess", message: "user register" });
  });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invaild email or user not found" });
    }
    if (!user.isValidatePassword(password)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invaild Password" });
    }
    const token = Auth.genarateToken(user.id);
    res.json({
      status: "sucess",
      message: "user login",
      token
    });
  });
});

module.exports = router;
