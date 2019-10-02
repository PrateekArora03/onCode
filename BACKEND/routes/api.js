const express = require("express");
const router = express.Router();

const indexRoutes = require("./index");
const userRoutes = require("./user");
const usersRoutes = require("./users");
const articleRoutes = require("./articles");
const commentRoutes = require("./comments");
const profileRoutes = require("./profiles");
const tagsRoutes = require("./tags");

router.use("/", indexRoutes);
router.use("/user", userRoutes);
router.use("/users", usersRoutes);
router.use("/articles", articleRoutes);
router.use("/profiles", profileRoutes);
// router.use(auth.verifyToken);
router.use("/comment", commentRoutes);
router.use("/tags", tagsRoutes);

module.exports = router;
