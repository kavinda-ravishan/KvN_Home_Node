const mongoose = require("mongoose");
const emitter = require("../startup/startup").emitter;

function mongoDBStatus(mongoDBStatusCode) {
  switch (mongoDBStatusCode) {
    case 0:
      return (mongoDBStatus = "Disconnected");
    case 1:
      return (mongoDBStatus = "Connected");

    case 2:
      return (mongoDBStatus = "Connecting");

    case 3:
      return (mongoDBStatus = "Disconnecting");

    default:
      return "Undefined";
  }
}

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8ji8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(
      `Mongo DB Status : ${mongoDBStatus(mongoose.connection.readyState)}`
    );
    if (mongoose.connection.readyState === 1) emitter.emit("MongoDBConnected");
  }
);

module.exports = mongoose;
