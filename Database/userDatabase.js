const Database = require("nedb");
const userDatabase = new Database("userDB.db");
userDatabase.loadDatabase();
module.exports = userDatabase;
