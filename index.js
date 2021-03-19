const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");

const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const dashboardRoute = require("./routes/dashboard");

app.use("/", express.static("public"));

app.use("/signup", express.json());
app.use("/signup", signupRoute);

app.use("/login", express.json());
app.use("/login", loginRoute);

app.use("/dashboard", cookieParser());
app.use("/dashboard", dashboardRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
