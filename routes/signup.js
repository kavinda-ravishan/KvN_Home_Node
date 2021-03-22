const router = require("express").Router();
const Joi = require("@hapi/joi");
const userDatabase = require("../Database/userDatabase");
const bcrypt = require("bcryptjs");
const mongoseDB = require("../Database/mongoDatabase");
const User = require("../model/user");

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
  //Match Password with confirm passwor
  if (req.body.password !== req.body.confirmPassword) {
    return res
      .status(400)
      .header("error", "Please make sure your passwords match")
      .end();
  }

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

    //Creating a new user
    const userDataForMongoDB = new User({
      email: reqBody.email,
      userName: reqBody.userName,
      password: hashedPassword,
    });

    userDatabase.insert(userDataForDB);

    //Check MongoDB status
    const mongoDBStatusCode = mongoseDB.connection.readyState;
    let mongoDBStatus = "";
    switch (mongoDBStatusCode) {
      case 0:
        mongoDBStatus = "Disconnected";
        break;
      case 1:
        mongoDBStatus = "Connected";
        break;
      case 2:
        mongoDBStatus = "Connecting";
        break;
      case 3:
        mongoDBStatus = "Disconnecting";
        break;

      default:
        break;
    }
    let isMogoRegistered = "";
    //Send user data to MongoDB
    try {
      await userDataForMongoDB.save();
      isMogoRegistered = "Registered";
    } catch (err) {
      isMogoRegistered = "Not Registered";
    }

    res
      .status(200)
      .json({
        msg: `User ${userData.userName} [MongoDB status : ${mongoDBStatus}, ${isMogoRegistered}] successfully registered.`,
      })
      .end();
  });
});

module.exports = router;
