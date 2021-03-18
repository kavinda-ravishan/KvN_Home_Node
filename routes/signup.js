const router = require("express").Router();
const Joi = require("@hapi/joi");

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

  //For now
  console.log(userData);
  res.status(200).header("id", 123).json({ msg: "OK" }).end();
});

module.exports = router;
