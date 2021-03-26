const jwt = require("jsonwebtoken");
const userDatabase = require("../Database/userDatabase");

function clearCookiesAndRedirect(res, redirectDes) {
  res
    .clearCookie("user-name")
    .clearCookie("session-token")
    .redirect(redirectDes);
}

function getSessionTime(iat) {
  return Math.round(Date.now() / 1000) - iat;
}

function authUser(req, res, next) {
  try {
    const token = req.cookies["session-token"];
    const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

    if (getSessionTime(ticket.iat) > 3600) {
      throw new Error("Session time expired");
    }

    next();
  } catch (err) {
    clearCookiesAndRedirect(res, "/login");
  }
}

function authAdmin(req, res, next) {
  try {
    const token = req.cookies["session-token"];
    const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

    userDatabase.findOne({ _id: ticket._id }, (err, user) => {
	  if (!user) {
        clearCookiesAndRedirect(res, "/login");
        return;
      }
		
      if (user.email !== "admin") {
        clearCookiesAndRedirect(res, "/login");
        return;
      }

      if (getSessionTime(ticket.iat) > 3600) {
        clearCookiesAndRedirect(res, "/login");
        return;
      }
      next();
    });
  } catch (err) {
    clearCookiesAndRedirect(res, "/login");
  }
}

module.exports.authUser = authUser;
module.exports.authAdmin = authAdmin;
