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

const userDatabase = require("./Database/userDatabase");
//Remove all from neDB
userDatabase.remove({}, { multi: true }, function (err, numRemoved) {});
//Get User data form MongoDB and load to neDB
const User = require("./model/user");
User.find({}, function (err, users) {
  for (user of users) {
    userDatabase.insert({
      email: user.email,
      userName: user.userName,
      password: user.password,
    });
  }
});

app.use("/", express.static("public"));

app.use("/signup", express.json());
app.use("/signup", signupRoute);

app.use("/login", express.json());
app.use("/login", loginRoute);

app.use("/dashboard", cookieParser());
app.use("/dashboard", dashboardRoute);

//MESSANGER
const jwt = require("jsonwebtoken");
const checkAuthenticated = require("./utility/checkAuthenticated");
const connectedUsers = {};
const Messages = [];

app.use("/users", cookieParser());
app.get("/users", checkAuthenticated, (req, res) => {
  res.send(Object.values(connectedUsers));
});

io.on("connection", (socket) => {
  socket.on("init", (token) => {
    try {
      const ticket = jwt.verify(token, process.env.TOKEN_SECRET);
      userDatabase.findOne({ _id: ticket._id }, (err, user) => {
        if (err) throw new Error(err);
        connectedUsers[socket.id] = user.userName;
        io.to(socket.id).emit("initChatMessages", Messages);
      });
    } catch (err) {
      return;
    }
  });

  socket.on("disconnect", () => {
    const name = connectedUsers[socket.id];
    if (name) {
      delete connectedUsers[socket.id];
    }
  });

  socket.on("chatMessage", (msg) => {
    const name = connectedUsers[socket.id];
    if (name) {
      if (Messages.length < 20) Messages.push(`${name} : ${msg}`);
      else {
        Messages.shift();
        Messages.push(`${name} : ${msg}`);
      }
      io.emit("chatMessage", { name: name, msg: msg });
    } else {
      io.to(socket.id).emit("chatMessage", {
        name: "Server",
        msg: "Please refresh the page",
      });
    }
  });
});
//

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
