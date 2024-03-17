const asyncHandler = require("express-async-handler");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLogged, isAdminBool, isMember } = require("../utils/utils");

const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

exports.index_get = asyncHandler(async function (req, res) {
  const posts = await postModel.find({}).populate("author", "username");
  res.render("index", {
    posts,
  });
});

exports.register_get = asyncHandler(async function (req, res) {
  res.render("register");
});

exports.register_post = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username should not be empty")
    .isAlphanumeric()
    .withMessage("username cannot contain symbols/space")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password should not be empty")
    .isAlphanumeric()
    .withMessage("password cannot contain symbols/space")
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", {
        errors: errors.array(),
        username: req.body.username,
        password: req.body.password,
      });
    } else {
      const user = new userModel();
      bcrypt.hash(req.body.password, 10, async (err, hashPassword) => {
        if (err) {
        } else {
          user.username = req.body.username;
          user.hash = hashPassword;
          await user.save();

          next();
        }
      });
    }
  }),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
];

exports.login_get = asyncHandler(async function (req, res) {
  res.render("login");
});

exports.login_post = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
];

exports.logout_get = function (req, res, next) {
  res.render("logout");
};

exports.logout_post = function (req, res, next) {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
};

exports.members_get = [
  isLogged,
  asyncHandler(function (req, res, next) {
    res.render("member");
  }),
];

exports.members_post = [
  isLogged,
  body("code")
    .trim()
    .notEmpty()
    .withMessage("code cannot be empty")
    .escape()
    .equals(process.env.MEMBER_CODE)
    .withMessage("entered code is wrong"),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("member", {
        errors: errors.array(),
        code: req.body.code,
      });
    } else {
      req.user.isMember = true;
      await req.user.save();
      res.redirect("/");
    }
  }),
];
