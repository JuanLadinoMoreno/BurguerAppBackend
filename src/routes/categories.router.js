import {Router} from 'express'
import { getCatProducts } from '../controllers/categories.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la categoría
 *         name:
 *           type: string
 *           description: Nombre de la categoría
 *         description:
 *           type: string
 *           description: Descripción de la categoría
 *         count:
 *           type: integer
 *           description: Cantidad de productos en la categoría
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         name: Hamburguesas
 *         description: Deliciosas hamburguesas caseras
 *         count: 5
 *
 *     CategoryProduct:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *         categoryName:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *       example:
 *         categoryId: 507f1f77bcf86cd799439011
 *         categoryName: Hamburguesas
 *         products:
 *           - id: 507f1f77bcf86cd799439012
 *             name: Hamburguesa Clásica
 *             price: 8.99
 *             description: Hamburguesa con queso y lechuga
 *           - id: 507f1f77bcf86cd799439013
 *             name: Hamburguesa Doble
 *             price: 12.99
 *             description: Hamburguesa doble con queso y bacon
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para obtener categorías y productos
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtiene todas las categorías con sus productos
 *     tags: [Categories]
 *     description: Retorna una lista de todas las categorías disponibles con los productos asociados a cada categoría
 *     responses:
 *       200:
 *         description: Categorías obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryProduct'
 *             example:
 *               - categoryId: 507f1f77bcf86cd799439011
 *                 categoryName: Hamburguesas
 *                 products:
 *                   - id: 507f1f77bcf86cd799439012
 *                     name: Hamburguesa Clásica
 *                     price: 8.99
 *                     description: Hamburguesa con queso y lechuga
 *               - categoryId: 507f1f77bcf86cd799439014
 *                 categoryName: Bebidas
 *                 products:
 *                   - id: 507f1f77bcf86cd799439015
 *                     name: Coca Cola 500ml
 *                     price: 2.50
 *                     description: Bebida refrescante
 *       500:
 *         description: Error interno del servidor
 */

const router = Router()

router.get('/', getCatProducts);

export default router