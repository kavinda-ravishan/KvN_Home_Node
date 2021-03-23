const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const app = require("./modules/modules").app;
const http = require("./modules/modules").http;
const io = require("./modules/modules").io;
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const dashboardRoute = require("./routes/dashboard");
const sysRoute = require("./routes/sys");
const usersRoute = require("./routes/users");
const startup = require("./startup/startup");

startup();

app.use("/", express.static("public"));

app.use("/signup", express.json());
app.use("/signup", signupRoute);

app.use("/login", express.json());
app.use("/login", loginRoute);

app.use("/dashboard", cookieParser());
app.use("/dashboard", dashboardRoute);

app.use("/users", cookieParser());
app.use("/users", usersRoute);

app.use("/sys", sysRoute);

//MESSANGER
const socketEvents = require("./utility/socketIO").socketEvents;
io.on("connection", socketEvents);
//

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
