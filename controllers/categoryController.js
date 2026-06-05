import { Category, Product } from '../models/index.js';
import { AppError } from '../middlewares/errorMiddleware.js';

// Obtener todas las categorías con sus productos asociados
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: Product,
        as: 'products',
        attributes: ['id', 'sku', 'name', 'price', 'stock']
      }
    });

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una categoría por ID
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: {
        model: Product,
        as: 'products',
        attributes: ['id', 'sku', 'name', 'price', 'stock']
      }
    });

    if (!category) {
      return next(new AppError('No se encontró ninguna categoría con ese ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva categoría
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const newCategory = await Category.create({
      name,
      description
    });

    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new AppError('No se encontró ninguna categoría con ese ID.', 404));
    }

    category.name = name !== undefined ? name : category.name;
    category.description = description !== undefined ? description : category.description;

    await category.save();

    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new AppError('No se encontró ninguna categoría con ese ID.', 404));
    }

    // La restricción RESTRICT configurada en el modelo evitará el borrado si hay productos vinculados
    await category.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
