const userDatabase = require("../Database/userDatabase");
const io = require("../modules/modules").io;
const jwt = require("jsonwebtoken");
const connectedUsers = {};
const Messages = [];

function socketEvents(socket) {
  socket.on("init", (token) => {
    try {
      const ticket = jwt.verify(token, process.env.TOKEN_SECRET);
      userDatabase.findOne({ _id: ticket._id }, (err, user) => {
        if (err) throw new Error(err);
        if (!user) return;
        connectedUsers[socket.id] = user.userName;
        io.to(socket.id).emit("initChatMessages", Messages);
        socket.broadcast.emit("userConnected", user.userName);
      });
    } catch (err) {
      return;
    }
  });

  socket.on("disconnect", () => {
    const name = connectedUsers[socket.id];
    if (name) {
      delete connectedUsers[socket.id];
      socket.broadcast.emit("userDisconnected", name);
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
        msg: "Please refresh the page or Signout and Login Agin",
      });
    }
  });
}

module.exports.socketEvents = socketEvents;
module.exports.connectedUsers = connectedUsers;
module.exports.Messages = Messages;
