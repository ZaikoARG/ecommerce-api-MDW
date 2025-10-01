import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';  // Protege todas las rutas

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestión del carrito de compras del usuario autenticado
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtiene el carrito del usuario autenticado (poblado con productos)
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 'Carrito del usuario (o {items: []} si vacío)'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                       quantity:
 *                         type: number
 *                         example: 1
 *       401:
 *         description: Acceso denegado
 *       500:
 *         description: Error al obtener el carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el carrito
 */
router.get('/', authMiddleware, getCart);                        // GET /api/cart - Obtener carrito

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agrega o incrementa un item en el carrito
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto (ObjectId)
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Carrito actualizado (poblado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                       quantity:
 *                         type: number
 *       400:
 *         description: ProductId y cantidad (min. 1) son requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ProductID y cantidad (min. 1) son requeridos
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto no encontrado
 *       500:
 *         description: Error al agregar al carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al agregar al carrito
 */
router.post('/add', authMiddleware, addToCart);                  // POST /api/cart/add - Agregar item

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Actualiza la cantidad de un item en el carrito
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Carrito actualizado (poblado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                       quantity:
 *                         type: number
 *       400:
 *         description: ProductId y cantidad (mín. 1) son requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ProductId y cantidad (mín. 1) son requeridos.
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Carrito o item no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item no encontrado en el carrito.
 *       500:
 *         description: Error al actualizar el carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar el carrito
 */
router.put('/update', authMiddleware, updateCartItem);           // PUT /api/cart/update - Actualizar cantidad

/**
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Elimina un item del carrito por ID de producto
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a remover (ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Carrito actualizado (poblado, item removido)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                       quantity:
 *                         type: number
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Carrito no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Carrito no encontrado.
 *       500:
 *         description: Error al eliminar el producto del carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el producto del carrito
 */
router.delete('/remove/:productId', authMiddleware, removeFromCart); // DELETE /api/cart/remove/:productId - Eliminar item

export default router;