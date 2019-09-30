var jwt = require("jsonwebtoken");

exports.genarateToken = function(userid) {
  if (userid) {
    return jwt.sign({ userid }, process.env.JWT_Secret, { expiresIn: "7d" });
  }
};
exports.verifyToken = function(req, res, next) {
  const token = req.headers.authorization || "";
  if (token) {
    jwt.verify(token, process.env.JWT_Secret, (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ status: "fail", message: "invalid token" });
      }
      req.userid = user.userid;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized access" });
  }
};
