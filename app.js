import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, AppError } from './middlewares/errorMiddleware.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Logger simple de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Ruta raíz para verificación simple de estado de la API
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '¡Bienvenido a la API RESTful de Inventario! Accede a /api-docs para ver la documentación de Swagger.',
    version: '1.0.0'
  });
});

// Configurar ruta para documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Montar enrutadores de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);

// Capturar cualquier ruta inexistente (404)
app.all('*', (req, res, next) => {
  next(new AppError(`No se encontró la ruta ${req.originalUrl} en este servidor.`, 404));
});

// Middleware centralizado de gestión de errores
app.use(errorHandler);

export default app;
