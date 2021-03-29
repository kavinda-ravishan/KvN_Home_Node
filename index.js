const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = require("./modules/modules").app;
const http = require("./modules/modules").http;
const io = require("./modules/modules").io;
const userDatabase = require("./Database/userDatabase");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const dashboardRoute = require("./routes/dashboard");
const adminRoute = require("./routes/admin");
const usersRoute = require("./routes/users");

app.use("/", express.static("public"));

app.use("/signup", express.json());
app.use("/signup", signupRoute);

app.use("/login", express.json());
app.use("/login", loginRoute);

app.use("/dashboard", cookieParser());
app.use("/dashboard", dashboardRoute);

app.use("/users", cookieParser());
app.use("/users", usersRoute);

app.use("/ad", cookieParser());
app.use("/ad", adminRoute);

//Register the admin
async function createAdmin() {
  //HASH the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(process.env.ADMIN, salt);

  const adminData = {
    email: "admin",
    userName: "admin",
    password: hashedPassword,
  };

  userDatabase.insert(adminData);
}
createAdmin();
//

//MESSANGER
const socketEvents = require("./utility/socketIO").socketEvents;
io.on("connection", socketEvents);
//

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
