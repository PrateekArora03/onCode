var jwt = require("jsonwebtoken");

exports.genarateToken = function(userID) {
  if (userID) {
    return jwt.sign(userID, "shhhhh");
  }
};
