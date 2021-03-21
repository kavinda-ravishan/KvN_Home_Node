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
//TESTING
const jwt = require("jsonwebtoken");
const userDatabase = require("./Database/userDatabase");
const connectedUsersDatabase = require("./Database/connectedUsersDatabase");
io.on("connection", (socket) => {
  socket.on("init", (token) => {
    try {
      const ticket = jwt.verify(token, process.env.TOKEN_SECRET);
      userDatabase.findOne({ _id: ticket._id }, (err, user) => {
        if (err) throw new Error(err);
        connectedUsersDatabase.insert({
          userName: user.userName,
          socketID: socket.id,
        });
      });
    } catch (err) {
      return;
    }
  });

  socket.on("disconnect", () => {
    try {
      connectedUsersDatabase.remove({ socketID: socket.id }, (err, user) => {
        if (err) throw new Error(err);
      });
    } catch (err) {
      return;
    }
  });

  socket.on("chatMessage", (data) => {
    try {
      connectedUsersDatabase.findOne({ socketID: socket.id }, (err, user) => {
        if (err) throw new Error(err);
        if (!user) {
          io.to(socket.id).emit("chatMessage", {
            name: "Server",
            msg: "Please refresh the page",
          });
          return;
        }
        io.emit("chatMessage", { name: user.userName, msg: data.msg });
      });
    } catch (err) {
      return;
    }
  });
});
//
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
