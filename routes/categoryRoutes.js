import express from 'express';
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de categorías requieren que el usuario esté autenticado
router.use(protect);

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías con sus productos
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente.
 *       401:
 *         description: No autorizado.
 *   post:
 *     summary: Crear una nueva categoría (Solo Admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electrónicos
 *               description:
 *                 type: string
 *                 example: Productos y componentes electrónicos de consumo
 *     responses:
 *       201:
 *         description: Categoría creada con éxito.
 *       400:
 *         description: Datos inválidos o nombre de categoría duplicado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 */
router.route('/')
  .get(getAllCategories)
  .post(restrictTo('admin'), createCategory);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la categoría (UUID)
 *     responses:
 *       200:
 *         description: Detalles de la categoría y sus productos asociados.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Categoría no encontrada.
 *   put:
 *     summary: Actualizar una categoría por su ID (Solo Admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la categoría (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electrónicos y Hogar
 *               description:
 *                 type: string
 *                 example: Artículos electrónicos y electrodomésticos para el hogar
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 *       404:
 *         description: Categoría no encontrada.
 *   delete:
 *     summary: Eliminar una categoría por su ID (Solo Admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la categoría (UUID)
 *     responses:
 *       204:
 *         description: Categoría eliminada con éxito. No retorna contenido.
 *       400:
 *         description: No se puede eliminar si la categoría tiene productos vinculados (Restricción de clave foránea).
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido (No es administrador).
 *       404:
 *         description: Categoría no encontrada.
 */
router.route('/:id')
  .get(getCategory)
  .put(restrictTo('admin'), updateCategory)
  .delete(restrictTo('admin'), deleteCategory);

export default router;
