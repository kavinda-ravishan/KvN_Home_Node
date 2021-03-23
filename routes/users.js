const router = require("express").Router();
const authUser = require("../utility/checkAuthenticated").authUser;
const connectedUsers = require("../utility/socketIO").connectedUsers;

router.get("/", authUser, (req, res) => {
  res.send(Object.values(connectedUsers));
});

module.exports = router;
