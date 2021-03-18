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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
