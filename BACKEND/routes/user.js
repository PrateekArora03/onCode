const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Auth = require("../auth/index");

//Get Current User
router.get("/", Auth.verifyToken, (req, res, next) => {
  User.findById(req.userid, (err, currentUser) => {
    if (err) return next(err);
    res.status(200).json(currentUser);
  });
});

router.post("/", (req, res, next) => {
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
//view user
router.get("/:username", (req, res, next) => {
  let username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    res.status(200).json(user);
  });
});

module.exports = router;
