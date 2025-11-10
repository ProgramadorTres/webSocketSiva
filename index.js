const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { registerSocketHandlers } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const createRouter = require('./router'); // importa la función

registerSocketHandlers(io);

app.use(express.json());
app.use('/', createRouter(io)); // 👈 aquí pasas io al router

server.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString()}] Servidor activo en puerto ${PORT}`);
});
