import { Router } from "express";
import { getBranch, createBranch, changeUserBranch, getBranchAvailable, updateBranchById } from "../controllers/branch.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createBranchSchema } from "../validations/branchs/create.schema.js";
import { updateBranchSchema, idParamSchema } from "../validations/branchs/update.schema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la sucursal
 *         name:
 *           type: string
 *           description: Nombre de la sucursal
 *         address:
 *           type: string
 *           description: Dirección de la sucursal
 *         phone:
 *           type: string
 *           pattern: '^\d{3}-\d{3}-\d{4}$'
 *           description: Número telefónico en formato 000-000-0000
 *         status:
 *           type: boolean
 *           description: Estado de la sucursal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         name: Sucursal Centro
 *         address: Calle Principal 123
 *         phone: 555-123-4567
 *         status: true
 *         createdAt: 2024-01-15T10:30:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: API para gestión de sucursales
 */

/**
 * @swagger
 * /api/branchs:
 *   get:
 *     summary: Obtiene todas las sucursales
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sucursales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/branchs:
 *   post:
 *     summary: Crea una nueva sucursal
 *     tags: [Branches]
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
 *               - address
 *               - phone
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *                 pattern: '^\d{3}-\d{3}-\d{4}$'
 *               status:
 *                 type: boolean
 *             example:
 *               name: Sucursal Norte
 *               address: Avenida Principal 456
 *               phone: 555-456-7890
 *               status: true
 *     responses:
 *       201:
 *         description: Sucursal creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/branchs/available:
 *   get:
 *     summary: Obtiene sucursales disponibles
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucursales disponibles obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/branchs/{bid}:
 *   put:
 *     summary: Actualiza una sucursal
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID de la sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *                 pattern: '^\d{3}-\d{3}-\d{4}$'
 *               status:
 *                 type: boolean
 *             example:
 *               name: Sucursal Centro Actualizada
 *               phone: 555-999-8888
 *     responses:
 *       200:
 *         description: Sucursal actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Datos o ID inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada
 */

/**
 * @swagger
 * /api/branchs/users/{uid}/sucursal:
 *   patch:
 *     summary: Cambia la sucursal de un usuario
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchId
 *             properties:
 *               branchId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *             example:
 *               branchId: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Sucursal del usuario actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o sucursal no encontrados
 */

const router = Router()

router.get('/', authMdw, getBranch);
router.post('/', authMdw, validateSchema(createBranchSchema), createBranch);
router.get('/available', authMdw, getBranchAvailable);
router.put('/:bid', authMdw, validateParams(idParamSchema), validateSchema(updateBranchSchema), updateBranchById);
router.patch('/users/:uid/sucursal', changeUserBranch);

export default router