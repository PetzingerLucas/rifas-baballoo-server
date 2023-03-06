const koa = require("koa");
const http = require("http");
const socket = require("socket.io");
const cors = require("@koa/cors");

const app = new koa();
app.use(cors());

const server = http.createServer(app.callback());

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

const SERVER_PORT = 8080;
const SERVER_HOST = "localhost";

io.on("connection", (socket) => {
  console.log("[IO] Connection => Server has new connection");
  socket.on("chat.message", (message) => {
    console.log("[SOCKET] message => ", message);
    io.emit("chat.message", message);
  });

  socket.on("selected", (isSelected, name, selectedName) => {
    console.log("[SOCKET] name => ", isSelected);
    io.emit("selected", isSelected, name, selectedName);
  });
  socket.on("disconnect", () => console.log("[SOCKET] Disconnected"));

  socket.on("raffle_info", (state) => {
    io.emit("raffle_info", state);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    ` [HTTP] Listen => Server running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
});
