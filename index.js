const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const { registerSocketHandlers } = require('./sockets/socketHandler');
const createRouter = require('./router');

const PORT = process.env.PORT || 4001;
const app = express();

let server;

// ✅ Si hay certificados definidos en el entorno, usar HTTPS
if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
  try {
    const key = fs.readFileSync(process.env.SSL_KEY_PATH);
    const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

    server = https.createServer({ key, cert }, app);
    console.log('🔐 Servidor iniciado con HTTPS');
  } catch (err) {
    console.error('⚠️ Error cargando certificados SSL:', err.message);
    console.log('➡️ Continuando con HTTP por fallback');
    server = http.createServer(app);
  }
} else {
  console.log('ℹ️ Certificados SSL no definidos. Usando HTTP');
  server = http.createServer(app);
}

const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registerSocketHandlers(io);
app.use('/', createRouter(io));

server.listen(PORT, '0.0.0.0', () => {
  const date = new Date().toLocaleString();
  console.log(`[${date}] 🚀 Servidor WebSocket corriendo en puerto ${PORT}`);
  console.log(`🌐 Modo: ${process.env.NODE_ENV}`);
});
