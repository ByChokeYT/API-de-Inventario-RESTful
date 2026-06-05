export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Registrar error para depuración en el servidor
  console.error('Error capturado por middleware:', err);

  // Formatear errores específicos de Sequelize (Validaciones y Restricciones de unicidad)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Error de validación en los datos enviados.',
      errors: errors
    });
  }

  // Errores de clave foránea en Sequelize (por ejemplo, al intentar borrar una categoría que tiene productos)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      status: 'fail',
      message: 'No se puede realizar la operación debido a una restricción de clave foránea. Verifica las relaciones de los datos.'
    });
  }

  // Manejo para ambiente de desarrollo
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Manejo para ambiente de producción
  // Si es un error operativo (creado por nosotros de forma controlada)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Errores de programación o inesperados
  return res.status(500).json({
    status: 'error',
    message: 'Algo salió mal en el servidor. Por favor, intenta de nuevo más tarde.'
  });
};

// Clase personalizada para manejar errores operativos
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
