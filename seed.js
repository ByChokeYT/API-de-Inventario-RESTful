import { sequelize, User, Category, Product } from './models/index.js';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Estableciendo conexión a PostgreSQL para siembra de datos...');

    // Sincronizar con force: true limpia las tablas existentes y las recrea
    await sequelize.sync({ force: true });
    console.log('Tablas recreadas limpiamente.');

    // 1. Crear Usuarios de prueba (las contraseñas se cifran automáticamente en el hook beforeSave)
    const admin = await User.create({
      username: 'admin',
      email: 'admin@inventario.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const staff = await User.create({
      username: 'empleado',
      email: 'empleado@inventario.com',
      password: 'empleadopassword123',
      role: 'staff'
    });

    console.log('-> Usuarios creados:');
    console.log('   Administrador: admin@inventario.com / adminpassword123');
    console.log('   Personal (Staff): empleado@inventario.com / empleadopassword123');

    // 2. Crear Categorías de prueba
    const electronics = await Category.create({
      name: 'Tecnología',
      description: 'Dispositivos de computación, accesorios y gadgets'
    });

    const furniture = await Category.create({
      name: 'Mobiliario',
      description: 'Muebles, escritorios y sillas de oficina'
    });

    console.log('-> Categorías creadas: "Tecnología" y "Mobiliario".');

    // 3. Crear Productos de prueba asociados a las categorías
    await Product.create({
      sku: 'LAP-LENOVO-T14',
      name: 'Laptop Lenovo ThinkPad T14',
      description: 'Procesador Ryzen 7, 16GB RAM, 512GB SSD, Windows 11 Pro',
      price: 999.99,
      stock: 12,
      categoryId: electronics.id
    });

    await Product.create({
      sku: 'MOU-LOGI-MX3',
      name: 'Mouse Logi MX Master 3S',
      description: 'Mouse inalámbrico ergonómico con sensor óptico de 8K DPI',
      price: 99.50,
      stock: 25,
      categoryId: electronics.id
    });

    await Product.create({
      sku: 'CHAIR-ERGO-01',
      name: 'Silla de Oficina Ergonómica',
      description: 'Silla ejecutiva con soporte lumbar de malla ajustable',
      price: 249.00,
      stock: 3, // Stock bajo (<= 5) para probar el filtro lowStock
      categoryId: furniture.id
    });

    console.log('-> Productos de prueba registrados.');
    console.log('¡Base de datos sembrada correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la siembra de la base de datos:', error);
    process.exit(1);
  }
};

seed();
