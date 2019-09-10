const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const commentRoutes = require("./routes/comment");

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
  err ? console.log(err) : console.log("connected to DB");
});
mongoose.set("useCreateIndex", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/blog", articleRoutes);
app.use("/comment", commentRoutes);

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Connected on ${PORT} port.`));
