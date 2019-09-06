const express = require("express");
const mongoose = require("mongoose");
const app = express();

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");

mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true }, err => {
  err ? console.log(err) : console.log("connected to DB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/blog", articleRoutes);

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Connected on ${PORT} port.`));
