const router = require("express").Router();
const checkAuthenticated = require("../utility/checkAuthenticated");
const connectedUsers = require("../utility/socketIO").connectedUsers;

router.get("/", checkAuthenticated, (req, res) => {
  res.send(Object.values(connectedUsers));
});

module.exports = router;
