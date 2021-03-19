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

app.get("/dashboard", (req, res) => {
  res.end("<h1>user</h1>");

  const token = req.cookies["session-token"];
  if (token) {
    console.log(token);

    const ticket = jwt.verify(token, process.env.TOKEN_SECRET);

    //TEST for session time
    const sessionTime = Math.round(Date.now() / 1000) - ticket.iat;
    console.log(sessionTime);
    //
  } else {
    console.log("Token not found");
  }
});
//

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
