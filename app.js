const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

var listener = server.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});

io.sockets.on("connection", socket => {
  console.log("Client connected: " + socket.id);

  socket.on("mouse", data => socket.broadcast.emit("mouse", data));

  socket.on("disconnect", () => console.log("Client has disconnected"));
});
