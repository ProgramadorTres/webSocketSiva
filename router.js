
// router.js
const express = require('express');

const createRouter = (io) => {
    const router = express.Router();

    // Endpoint para recibir eventos desde Laravel
    router.post('/emit', (req, res) => {
        const { event, data } = req.body;
        console.log(`[${new Date().toLocaleString()}] 📨 Evento recibido desde Laravel: ${event}`);
        if (event && data) {
            if (event === 'notifyTaskCreated') {
                //  Notificar usuarios específicos
                const userIds = data.user_ids || [data.executor_id, data.responsible_id];
                
                console.log(`👥 Usuarios a notificar: ${userIds.join(', ')}`);
                
                userIds.forEach(userId => {
                    if (userId) {
                        // Enviar a la sala específica del usuario
                        io.to(`user_${userId}`).emit('notificacion', {
                            titulo: data.titulo || 'Nueva Tarea Asignada',
                            mensaje: data.mensaje || `Se te ha asignado la tarea: ${data.name}`,
                            fecha: data.fecha || new Date().toLocaleString(),
                            task_id: data.task_id,
                            type: 'task_created'
                        });
                        console.log(`Notificación enviada a usuario ${userId}`);
                    }
                });
            } else {
                // Para otros eventos, emitir normalmente
                io.emit(event, data);
            }
            

            console.log(`Evento ${event} procesado correctamente`)
            res.json({ 
                
                
                success: true, 
                message: `Evento ${event} procesado correctamente` 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Faltan event o data en el cuerpo de la solicitud' 
            });
        }
    });

    return router;
};

module.exports = createRouter;