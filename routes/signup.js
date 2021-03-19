const router = require("express").Router();
const Joi = require("@hapi/joi");
const userDatabase = require("../Database/userDatabase");
const bcrypt = require("bcryptjs");

//Signin validation
const signinValidation = (data) => {
  const schema = Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    userName: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

router.post("/", async (req, res) => {
  //Get Data from req Boy
  const reqBody = req.body;
  const userData = {
    email: reqBody.email,
    userName: reqBody.userName,
    password: reqBody.password,
  };

  //Validate user data
  const { error } = signinValidation(userData);
  if (error) {
    return res.status(400).header("error", error.details[0].message).end();
  }

  userDatabase.findOne({ email: userData.email }, async function (err, user) {
    if (user) {
      return res.status(400).header("error", "Email already Exists!").end();
    }
    //HASH the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const userDataForDB = {
      email: reqBody.email,
      userName: reqBody.userName,
      password: hashedPassword,
    };

    userDatabase.insert(userDataForDB);
    res
      .status(200)
      .json({ msg: `User ${userData.userName} successfully registered.` })
      .end();
  });
});

module.exports = router;
