const router = require("express").Router();
const userController = require("../controllers/userController");
const auth_mid = require("../middlewares");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/token", auth_mid.verifyRefreshToken, userController.token);
router.get("/logout", auth_mid.verifyToken, userController.logout)

module.exports = router;
