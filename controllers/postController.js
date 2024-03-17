const asyncHandler = require("express-async-handler");
const { validationResult, body } = require("express-validator");
const postModel = require("../models/postModel");
const { isMember, isLogged } = require("../utils/utils");

exports.post_create_get = [
  isLogged,
  isMember,
  asyncHandler(function (req, res) {
    res.render("post_create");
  }),
];

exports.post_create_post = [
  isLogged,
  isMember,
  body("title").trim().notEmpty().withMessage("title cannot be empty").escape(),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("post_create", {
        errors: errors.array(),
        title: req.body.title,
        content: req.body.content,
      });
    } else {
      const post = new postModel();
      post.title = req.body.title;
      post.content = req.body.content;
      post.author = req.user._id;
      await post.save();
      res.redirect("/");
    }
  }),
];

exports.post_delete_post = asyncHandler(async function (req, res, next) {
  await postModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
