const express = require("express");
const indexController = require("../controllers/indexController");
const { isLogged } = require("../utils/utils");
const router = express.Router();
// const isAuth = require("../utils/authMiddleware");

/* GET home page. */
router.get("/", indexController.index_get);

router.get("/login", indexController.login_get);
router.post("/login", indexController.login_post);

router.get("/logout", indexController.logout_get);
router.post("/logout", indexController.logout_post);

router.get("/register", indexController.register_get);
router.post("/register", indexController.register_post);

router.get("/member", indexController.members_get);
router.post("/member", indexController.members_post);

module.exports = router;
