const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

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

const jwt = require("jsonwebtoken");
const userDatabase = require("./Database/userDatabase");
io.on("connection", (socket) => {
  socket.on("chatMessage", (data) => {
    try {
      const ticket = jwt.verify(data.token, process.env.TOKEN_SECRET);
      userDatabase.findOne({ _id: ticket._id }, (err, user) => {
        if (err) throw new Error(err);
        io.emit("chatMessage", { name: user.userName, msg: data.msg });
      });
    } catch (err) {
      return;
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
