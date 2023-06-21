const router = require("express").Router();
const auth_mid = require("../middlewares");

router.get("/dashboard", auth_mid.verifyToken, (req, res) => {
  return res.json({
    success: true,
    message: "Dashboard",
  });
});

module.exports = router;
