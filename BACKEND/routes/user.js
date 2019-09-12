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

router.patch("/profileupdate", Auth.verifyToken, (req, res, next) => {
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
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) return next(err);
    res.status(200).json(user);
  });
});

module.exports = router;
