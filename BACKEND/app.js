const express = require("express");
const mongoose = require("mongoose");
const app = express();
const auth = require("./auth/index");
require("dotenv").config();
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const usersRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const commentRoutes = require("./routes/comments");
const profileRoutes = require("./routes/profiles");

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
  err ? console.log(err) : console.log("connected to DB");
});
mongoose.set("useCreateIndex", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/users", usersRoutes);
app.use("/blog", articleRoutes);
app.use("/profiles", profileRoutes);
// app.use(auth.verifyToken);
app.use("/comment", commentRoutes);

app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

app.use((err, req, res, next) => {
  res.json({ err });
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Connected on ${PORT} port.`));
