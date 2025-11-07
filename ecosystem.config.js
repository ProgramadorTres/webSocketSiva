export default {
  apps: [{
    name: 'celya-api',
    script: './patron_mv/app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 1234,
      PORTSERVER: 3000,
      DBNAME: 'development_db'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 1234,
      PORTSERVER: 3000,
      //DBNAME: 'production_db'
    },
    env_file: '.env'
  }]
}