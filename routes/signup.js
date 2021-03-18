const router = require("express").Router();
const Joi = require("@hapi/joi");

const userDatabase = require("../Database/userDatabase");

//Signin validation
const signinValidation = (data) => {
  const schema = Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    userName: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

router.post("/", (req, res) => {
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

  userDatabase.find({ email: userData.email }, function (err, users) {
    if (users.length) {
      res.status(400).header("error", "Email already Exists!").end();
    } else {
      userDatabase.insert(userData);
      res
        .status(200)
        .json({ msg: `User ${userData.userName} successfully registered.` })
        .end();
    }
  });
});

module.exports = router;
