const { Server } = require("socket.io");

const app = require("express")();

const cors = require("cors");
app.use(cors());

const server = require("./vercel.js");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Variável para armazenar as informações da rifa
let raffleInfo = {};

// Objeto para armazenar as seleções
let selections = {};

io.on("connection", (socket) => {
  console.log("[IO] Connection => Server has new connection");

  // Envia as informações da rifa e as seleções para o novo usuário conectado
  socket.emit("raffle_info", raffleInfo);
  socket.emit("selected", selections);

  socket.on("chat.message", (message) => {
    console.log("[SOCKET] message => ", message);
    io.emit("chat.message", message);
  });

  console.log(`User connected: ${socket.id}`);
  // Notificar todos os clientes sobre um novo usuário conectado
  io.emit("user_connected", socket.id);

  // ...

  socket.on("selected", (newSelections) => {
    // Atualiza as seleções
    selections = newSelections;

    // Envia as novas seleções para todos os usuários conectados
    io.emit("selected", selections);
  });

  socket.on("disconnect", () => console.log("[SOCKET] Disconnected"));

  socket.on("get_raffle_info", () => {
    socket.emit("raffle_info", raffleInfo);
    console.log(raffleInfo);
  });

  socket.on("update_raffle_info", (newRaffleInfo) => {
    // Atualiza as informações da rifa
    raffleInfo = newRaffleInfo;

    // Envia as novas informações da rifa para todos os usuários conectados
    io.emit("raffle_info", raffleInfo);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("[HTTP] Listen => Server running");
});

module.exports = server;
