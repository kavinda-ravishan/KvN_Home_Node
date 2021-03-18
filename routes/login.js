const router = require("express").Router();
const userDatabase = require("../Database/userDatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.post("/", async (req, res) => {
  //Get Data from req Boy
  const reqBody = req.body;
  const userData = {
    email: reqBody.email,
    password: reqBody.password,
  };

  userDatabase.find({ email: userData.email }, async function (err, users) {
    if (users.length) {
      const user = users[0];

      //Match the password
      const validPass = await bcrypt.compare(userData.password, user.password);
      if (!validPass) {
        return res.status(400).header("error", "Password invalid !").end();
      }

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      console.log(token);
      const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

      //TEST for session time
      const sessionTime = Math.round(Date.now() / 1000) - ticket.iat;
      console.log(sessionTime);
      //

      res
        .status(200)
        .cookie("session-token", token)
        .cookie("user-name", user.userName)
        .cookie("email", user.email)
        .json({ msg: `User ${user.userName} successfully logged in.` })
        .end();
    } else {
      res.status(400).header("error", "Email Does Not Exists!").end();
    }
  });
});

module.exports = router;
