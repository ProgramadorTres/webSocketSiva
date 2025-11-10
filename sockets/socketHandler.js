const registerSocketHandlers = (io) => {
    const userSockets = new Map(); // userId -> socketId

    io.on('connection', (socket) => {
        //console.log(`[${new Date().toLocaleString()}] 🔗 Nueva conexión: ${socket.id}`);
        socket.on('registerUser', (userId) => {
            //console.log(`[${new Date().toLocaleString()}] Usuario ${userId} registrado en sala user_${userId}`);
            
            // Unir al usuario a su sala personal
            socket.join(`user_${userId}`);
            userSockets.set(userId.toString(), socket.id);
            
            //console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
        });

        socket.on('disconnect', () => {
            console.log(`[${new Date().toLocaleString()}] Cliente desconectado: ${socket.id}`);
        
            for (let [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    //console.log(` Usuario ${userId} desconectado`);
                    break;
                }
            }
        });
    });
};

module.exports = { registerSocketHandlers };