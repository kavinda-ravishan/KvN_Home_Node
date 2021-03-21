const router = require("express").Router();
const path = require("path");
const checkAuthenticated = require("../utility/checkAuthenticated");

router.get("/", checkAuthenticated, (req, res) => {
  res.sendFile(path.resolve("private/dashboard.html"));
});

module.exports = router;
