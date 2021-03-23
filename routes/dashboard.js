const router = require("express").Router();
const path = require("path");
const authUser = require("../utility/checkAuthenticated").authUser;

router.get("/", authUser, (req, res) => {
  res.sendFile(path.resolve("private/dashboard.html"));
});

module.exports = router;
