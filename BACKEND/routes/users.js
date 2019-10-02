const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Auth = require("../auth/index");

//create user
router.post("/", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.json({ status: "success", message: "user register" });
  });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ status: false, message: "Please Fill Both Fields" });
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invaild email or user not found" });
    }
    if (!user.isValidatePassword(password)) {
      return res
        .status(400)
        .json({ status: false, message: "Invaild Password" });
    }
    const token = Auth.genarateToken(user.id);
    res.json({
      status: "sucess",
      message: "user login",
      token
    });
  });
});
//view user
router.get("/:username", (req, res, next) => {
  let username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    res.status(200).json(user);
  });
});

module.exports = router;
