const jwt = require("jsonwebtoken");
const userDatabase = require("../Database/userDatabase");

function authUser(req, res, next) {
  try {
    const token = req.cookies["session-token"];
    const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

    //Calculate session time
    const sessionTime = Math.round(Date.now() / 1000) - ticket.iat;
    if (sessionTime > 3600) {
      throw new Error("Session time expired");
    }
    //
    next();
  } catch (err) {
    res
      .clearCookie("user-name")
      .clearCookie("session-token")
      .redirect("/login");
  }
}

function authAdmin(req, res, next) {
  try {
    const token = req.cookies["session-token"];
    const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

    userDatabase.findOne({ _id: ticket._id }, (err, user) => {
      if (!user) {
        return res
          .clearCookie("user-name")
          .clearCookie("session-token")
          .redirect("/login");
      }
      if (user.userName !== "admin") {
        return res
          .clearCookie("user-name")
          .clearCookie("session-token")
          .redirect("/login");
      }
      //Calculate session time
      const sessionTime = Math.round(Date.now() / 1000) - ticket.iat;
      if (sessionTime > 3600) {
        return res
          .clearCookie("user-name")
          .clearCookie("session-token")
          .redirect("/login");
      }
      next();
    });
  } catch (err) {
    res
      .clearCookie("user-name")
      .clearCookie("session-token")
      .redirect("/login");
  }
}

module.exports.authUser = authUser;
module.exports.authAdmin = authAdmin;
