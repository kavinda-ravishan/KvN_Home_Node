const router = require("express").Router();
const userDatabase = require("../Database/userDatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  //Get Data from req Boy
  const reqBody = req.body;
  const userData = {
    email: reqBody.email,
    password: reqBody.password,
  };

  userDatabase.findOne({ email: userData.email }, async function (err, user) {
    if (user) {
      //Match the password
      const validPass = await bcrypt.compare(userData.password, user.password);
      if (!validPass) {
        return res.status(400).header("error", "Password invalid !").end();
      }

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

      res
        .status(200)
        .cookie("session-token", token)
        .cookie("user-name", user.userName)
        .json({ msg: `User ${user.userName} successfully logged in.` })
        .end();
    } else {
      res.status(400).header("error", "Email Does Not Exists!").end();
    }
  });
});

module.exports = router;
