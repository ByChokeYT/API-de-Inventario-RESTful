import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de productos requieren estar autenticado
router.use(protect);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Obtener todos los productos con filtros opcionales
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de la categoría (UUID)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por coincidencia parcial en nombre o SKU del producto
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar productos con stock crítico (5 unidades o menos)
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente.
 *       401:
 *         description: No autorizado.
 *   post:
 *     summary: Crear un nuevo producto (Solo Admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               sku:
 *                 type: string
 *                 example: TECL-MECO-001
 *               name:
 *                 type: string
 *                 example: Teclado Mecánico RGB
 *               description:
 *                 type: string
 *                 example: Teclado mecánico con switches red y retroiluminación RGB
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 89.99
 *               stock:
 *                 type: integer
 *                 default: 0
 *                 example: 50
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 50b07e5b-b9f8-4e12-8703-a134bfd27db1
 *     responses:
 *       201:
 *         description: Producto creado con éxito.
 *       400:
 *         description: Datos inválidos (SKU duplicado, categoría no existente, stock o precio negativo).
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 */
router.route('/')
  .get(getAllProducts)
  .post(restrictTo('admin'), createProduct);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Obtener detalles de un producto por su ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del producto (UUID)
 *     responses:
 *       200:
 *         description: Detalles del producto y de su categoría.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Producto no encontrado.
 *   put:
 *     summary: Actualizar un producto por su ID (Solo Admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del producto (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 example: TECL-MECO-001B
 *               name:
 *                 type: string
 *                 example: Teclado Mecánico RGB Pro
 *               description:
 *                 type: string
 *                 example: Teclado mecánico premium con switches lubricados
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               stock:
 *                 type: integer
 *                 example: 45
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 50b07e5b-b9f8-4e12-8703-a134bfd27db1
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 *       404:
 *         description: Producto no encontrado.
 *   delete:
 *     summary: Eliminar un producto por su ID (Solo Admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del producto (UUID)
 *     responses:
 *       204:
 *         description: Producto eliminado con éxito. No retorna contenido.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 *       404:
 *         description: Producto no encontrado.
 */
router.route('/:id')
  .get(getProduct)
  .put(restrictTo('admin'), updateProduct)
  .delete(restrictTo('admin'), deleteProduct);

/**
 * @openapi
 * /products/{id}/adjust-stock:
 *   post:
 *     summary: Ajuste manual de stock (Entradas y Salidas de Inventario) (Admin/Staff)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del producto (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Cantidad a ajustar. Positivo para entrada de stock, negativo para salida.
 *                 example: -10
 *     responses:
 *       200:
 *         description: Stock ajustado exitosamente. Retorna el producto con el stock actualizado.
 *       400:
 *         description: Datos inválidos o stock resultante menor que cero (stock insuficiente).
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Producto no encontrado.
 */
router.post('/:id/adjust-stock', adjustStock);

export default router;
