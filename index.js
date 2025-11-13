/*

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
*/

const express = require('express');
const https = require('https');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const { registerSocketHandlers } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const app = express();
let server;

// Detectar entorno
const isProduction = NODE_ENV === 'production';
const isSivarem2 = CORS_ORIGIN.includes('sivarem2');
const isSivarem3 = CORS_ORIGIN.includes('sivarem3');

let environment = 'DESARROLLO';
if (isProduction) {
  environment = isSivarem2 ? 'PRODUCCIÓN (sivarem2)' : 'PRUEBAS (sivarem3)';
}

console.log(`🚀 Iniciando servidor Socket.io`);
console.log(`📍 Entorno: ${environment}`);
console.log(`📊 Puerto: ${PORT}`);
console.log(`🌐 CORS: ${CORS_ORIGIN}`);

// Configurar servidor HTTP o HTTPS
if (isProduction && SSL_KEY_PATH && SSL_CERT_PATH) {
  // Verificar que existan los certificados SSL
  if (!fs.existsSync(SSL_KEY_PATH) || !fs.existsSync(SSL_CERT_PATH)) {
    console.error('❌ Error: Certificados SSL no encontrados');
    console.error(`🔑 KEY: ${SSL_KEY_PATH}`);
    console.error(`📄 CERT: ${SSL_CERT_PATH}`);
    process.exit(1);
  }

  const sslOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };

  server = https.createServer(sslOptions, app);
  console.log('🔐 SSL: Activado (HTTPS)');
} else {
  server = http.createServer(app);
  console.log('🔓 SSL: Desactivado (HTTP)');
}

// Configurar Socket.io
const io = socketIo(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

const createRouter = require('./router'); // Tu router existente

// Registrar handlers de Socket.io
registerSocketHandlers(io);

// Middlewares
app.use(express.json());
app.use('/', createRouter(io)); // 👈 Así deberías tenerlo ya

// Ruta de salud para verificar el entorno
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    environment: environment,
    port: PORT,
    ssl: isProduction && SSL_KEY_PATH ? 'enabled' : 'disabled',
    cors: CORS_ORIGIN,
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`✅ Servidor ${environment} activo en puerto ${PORT}`);
  console.log(`⏰ Iniciado: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
});