const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

/* GET users listing. */
router.get("/create", postController.post_create_get);
router.post("/create", postController.post_create_post);

router.post("/delete/:id", postController.post_delete_post);

module.exports = router;
