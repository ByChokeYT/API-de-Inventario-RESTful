import { Product, Category } from '../models/index.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { Op } from 'sequelize';

// Obtener todos los productos (soporta filtros por categoría, búsqueda por nombre/sku, y alerta de bajo stock)
export const getAllProducts = async (req, res, next) => {
  try {
    const { categoryId, search, lowStock } = req.query;
    const whereClause = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      // Búsqueda insensible a mayúsculas/minúsculas para PostgreSQL
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (lowStock === 'true') {
      // Stock menor o igual a 5 unidades se considera bajo stock
      whereClause.stock = { [Op.lte]: 5 };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un solo producto por su ID
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    });

    if (!product) {
      return next(new AppError('No se encontró ningún producto con ese ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res, next) => {
  try {
    const { sku, name, description, price, stock, categoryId } = req.body;

    // Verificar si la categoría existe antes de intentar asignar
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return next(new AppError('La categoría especificada no existe.', 400));
    }

    const newProduct = await Product.create({
      sku,
      name,
      description,
      price,
      stock,
      categoryId
    });

    // Devolver producto incluyendo los datos de la categoría
    const productWithCategory = await Product.findByPk(newProduct.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        product: productWithCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res, next) => {
  try {
    const { sku, name, description, price, stock, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new AppError('No se encontró ningún producto con ese ID.', 404));
    }

    // Si se pasa una nueva categoría, verificar que exista
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return next(new AppError('La categoría especificada no existe.', 400));
      }
      product.categoryId = categoryId;
    }

    product.sku = sku !== undefined ? sku : product.sku;
    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;

    await product.save();

    const productWithCategory = await Product.findByPk(product.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        product: productWithCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new AppError('No se encontró ningún producto con ese ID.', 404));
    }

    await product.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Ajuste manual de stock (Entradas y Salidas de Inventario)
export const adjustStock = async (req, res, next) => {
  try {
    const { quantity } = req.body; // quantity es un entero que puede ser positivo (entrada) o negativo (salida)

    if (quantity === undefined || isNaN(quantity)) {
      return next(new AppError('Debes proporcionar una cantidad numérica en "quantity".', 400));
    }

    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    });

    if (!product) {
      return next(new AppError('No se encontró ningún producto con ese ID.', 404));
    }

    const updatedStock = product.stock + Number(quantity);

    // Impedir que el stock sea menor que cero
    if (updatedStock < 0) {
      return next(new AppError(`Stock insuficiente para realizar la transacción. Stock actual: ${product.stock}, cantidad solicitada: ${Math.abs(quantity)}.`, 400));
    }

    product.stock = updatedStock;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Stock ajustado correctamente.',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};
