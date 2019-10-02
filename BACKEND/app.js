const express = require("express");
const mongoose = require("mongoose");
const app = express();
const auth = require("./auth/index");
require("dotenv").config();
const apiRoutes = require("./routes/api");
mongoose.connect(process.env.DB_CONNECTS, { useNewUrlParser: true }, err => {
  err ? console.log(err) : console.log("connected to DB");
});
mongoose.set("useCreateIndex", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

app.use((err, req, res, next) => {
  res.json({ err });
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => console.log(`Connected on ${PORT} port.`));
