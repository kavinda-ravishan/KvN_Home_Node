const mongoseDB = require("../Database/mongoDatabase");
const Message = require("../model/message");
const userDatabase = require("../Database/userDatabase");
const User = require("../model/user");
const Messages = require("../utility/socketIO").Messages;

module.exports = () => {
  Message.find({}, function (err, messages) {
    if (err) return;
    for (message of messages) {
      Messages.push(message);
    }
  });

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
