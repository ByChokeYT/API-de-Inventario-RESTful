import sequelize from '../config/database.js';
import User from './user.js';
import Category from './category.js';
import Product from './product.js';

// Definición de Relaciones
// Una Categoría tiene muchos Productos
Category.hasMany(Product, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false
  },
  as: 'products',
  onDelete: 'RESTRICT', // Evita borrar una categoría si tiene productos asociados
  onUpdate: 'CASCADE'
});

// Un Producto pertenece a una Categoría
Product.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false
  },
  as: 'category'
});

export {
  sequelize,
  User,
  Category,
  Product
};
