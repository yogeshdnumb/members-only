const passport = require("passport");
const asyncHandler = require("express-async-handler");

exports.isLogged = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You should login to access this page");
  }
};

exports.isMember = asyncHandler(function (req, res, next) {
  if (req.user.isMember) {
    next();
  } else {
    res.status(401).send("You should be a member to access this page");
  }
});

// returns true if user is admin
// exports.isAdminBool = asyncHandler(function (req, res, next) {
//   if (req.user.isAdmin) {
//     return true;
//   } else {
//     return false;
//   }
// });
// exports.isMemberBool = asyncHandler(function (req, res, next) {
//   if (req.user.isMember) {
//     return true;
//   } else {
//     return false;
//   }
// });
