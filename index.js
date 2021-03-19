const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");

app.use("/", express.static("public"));

app.use("/signup", express.json());
app.use("/signup", signupRoute);

app.use("/login", express.json());
app.use("/login", loginRoute);

//TEST
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

function checkAuthenticated(req, res, next) {
  const token = req.cookies["session-token"];
  if (token) {
    try {
      const ticket = jwt.verify(token, process.env.TOKEN_SECRET);
      //console.log(token);
      //console.log(ticket);
      //TEST for session time
      //const sessionTime = Math.round(Date.now() / 1000) - ticket.iat;
      //console.log(sessionTime);
      //

      next();
    } catch (err) {
      res
        .clearCookie("email")
        .clearCookie("user-name")
        .clearCookie("session-token")
        .redirect("/login");
    }
  } else {
    res
      .clearCookie("email")
      .clearCookie("user-name")
      .clearCookie("session-token")
      .redirect("/login");
  }
}

app.get("/dashboard", checkAuthenticated, (req, res) => {
  res.end("<h1>user</h1>");
});
//

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
