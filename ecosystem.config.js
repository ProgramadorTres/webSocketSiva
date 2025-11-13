// ecosystem.config.js
module.exports = {
  apps: [{
     name: "socket_fpn",
    script: "./index.js",
    instances: 1,
    exec_mode: "fork",
    // Agregar estas opciones para mejor identificación
    instance_var: "INSTANCE_ID",
    env: {
      NODE_ENV: "development",
      PORT: 4001,
      APP_NAME: "socket_fpn"  // ← Esto ayuda a identificar
    },
    env_production: {
      NODE_ENV: "production",     // Entorno de producción
      PORT: 4001
    },
    // Configuración de logs
    log_file: "./logs/combined.log",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    // Opciones de reinicio automático
    autorestart: true,
    max_restarts: 10,
    min_uptime: "10s"
  }]
};