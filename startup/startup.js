const mongoseDB = require("../Database/mongoDatabase");
const userDatabase = require("../Database/userDatabase");
const User = require("../model/user");

module.exports = () => {
  //Remove all from neDB
  userDatabase.remove({}, { multi: true }, function (err, numRemoved) {});
  //Get User data form MongoDB and load to neDB
  User.find({}, function (err, users) {
    if (mongoseDB.connection.readyState === 1) {
      for (user of users) {
        userDatabase.insert({
          email: user.email,
          userName: user.userName,
          password: user.password,
        });
      }
    }
  });
};
