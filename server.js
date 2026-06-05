import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './models/index.js';

// Manejo de excepciones no capturadas (Uncaught Exceptions)
process.on('uncaughtException', (err) => {
  console.error('EXCEPCIÓN NO CAPTURADA! 💥 Apagando el servidor...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config();

const port = process.env.PORT || 3000;

let server;

// Inicialización de la base de datos y arranque del servidor
const startServer = async () => {
  try {
    // Verificar conexión física a la base de datos
    await sequelize.authenticate();
    console.log('Conexión establecida con éxito con PostgreSQL.');

    // Sincronizar modelos.
    // 'alter: true' ajusta las tablas en la base de datos de desarrollo para que coincidan con los modelos.
    const syncOptions = process.env.NODE_ENV === 'development' ? { alter: true } : {};
    await sequelize.sync(syncOptions);
    console.log('Modelos de la base de datos sincronizados correctamente.');

    // Iniciar servidor Express
    server = app.listen(port, () => {
      console.log(`Servidor iniciado en puerto ${port} en modo [${process.env.NODE_ENV || 'development'}]`);
      console.log(`Prueba la API en: http://localhost:${port}`);
      console.log(`Documentación de Swagger en: http://localhost:${port}/api-docs`);
    });

    // Manejo de rechazos de promesas no capturadas (Unhandled Rejections)
    process.on('unhandledRejection', (err) => {
      console.error('RECHAZO DE PROMESA NO CONTROLADO! 💥 Apagando graciosamente...');
      console.error(err.name, err.message);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error al inicializar la base de datos o el servidor:', error);
    process.exit(1);
  }
};

startServer();
