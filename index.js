const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { registerSocketHandlers } = require('./sockets/socketHandler');
const createRouter = require('./router'); // importa la función

const PORT = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);

// ✅ CONFIGURAR SOCKET.IO CORRECTAMENTE
const io = socketIo(server, { 
    cors: {
        origin: "*", // Permite todas las conexiones
        methods: ["GET", "POST"]
    }
});

// ✅ CONFIGURAR MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ REGISTRAR MANEJADORES DE SOCKET
registerSocketHandlers(io);

// ✅ CONFIGURAR RUTAS PASANDO io
app.use('/', createRouter(io));

// ✅ INICIAR SERVIDOR EN 0.0.0.0
server.listen(PORT, '0.0.0.0', () => {
    const date = new Date().toLocaleString();
    console.log(`[${date}] 🚀 Servidor WebSocket ejecutándose en puerto ${PORT}`);
    console.log(`📍 Accesible en: http://localhost:${PORT}`);
    console.log(`🌐 Accesible desde red: http://TU-IP:${PORT}`);
});

// Manejo de errores
server.on('error', (error) => {
    console.error('❌ Error del servidor:', error);
});