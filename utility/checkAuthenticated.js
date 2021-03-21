const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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
};
