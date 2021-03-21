const Database = require("nedb");
const connectedUsersDatabase = new Database("connectedUsersDB.db");
connectedUsersDatabase.remove(
  {},
  { multi: true },
  function (err, numRemoved) {}
);
connectedUsersDatabase.loadDatabase();
module.exports = connectedUsersDatabase;
