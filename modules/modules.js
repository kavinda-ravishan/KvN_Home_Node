const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

module.exports.app = app;
module.exports.http = http;
module.exports.io = io;
