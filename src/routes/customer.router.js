import { Router } from "express";
import { deleteCustomerById, getCustomerById, getCustomers, register, updateCustomerById } from "../controllers/customers.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createSchema } from "../validations/customers/create.schema.js";
import { updateSchema, idParamSchema } from "../validations/customers/update.schema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del cliente
 *         firstName:
 *           type: string
 *           description: Nombre del cliente
 *         lastName:
 *           type: string
 *           description: Apellido del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
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
 *         firstName: Juan
 *         lastName: Robles
 *         phone: "+54 9 11 1234-5678"
 *         email: juan@example.com
 *         createdAt: 2024-01-15T10:30:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API para gestión de clientes
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Registra un nuevo cliente
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del cliente
 *               lastName:
 *                 type: string
 *                 description: Apellido del cliente
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del cliente
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del cliente
 *             example:
 *               firstName: Juan
 *               lastName: Robles
 *               phone: "+54 9 11 1234-5678"
 *               email: juan@example.com
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 message: Validation error
 *                 errors:
 *                   - "Nombre es requerido"
 *                   - "Email invalido"
 *       401:
 *         description: No autorizado - se requiere autenticación de administrador
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/customers/{cid}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del cliente (formato MongoDB)
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 message: Validation error
 *                 errors:
 *                   - "El ID debe tener formato MongoDB (24 caracteres hex)"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */

/**
 * @swagger
 * /api/customers/{cid}:
 *   put:
 *     summary: Actualiza un cliente
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del cliente (formato MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del cliente
 *               lastName:
 *                 type: string
 *                 description: Apellido del cliente
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del cliente
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del cliente
 *             example:
 *               firstName: Juan
 *               lastName: Pérez
 *               phone: "+54 9 11 9876-5432"
 *               email: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 message: Validation error
 *                 errors:
 *                   - "Email invalido"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */

/**
 * @swagger
 * /api/customers/{cid}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del cliente (formato MongoDB)
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */

const router = Router()

router.post('/register', authMdw, verifyAdminRoleMdw, validateSchema(createSchema), register)
router.get('/', authMdw, getCustomers)
router.get('/:cid', authMdw, verifyAdminRoleMdw, validateParams(idParamSchema), getCustomerById)
router.put('/:cid', authMdw, verifyAdminRoleMdw, validateParams(idParamSchema), validateSchema(updateSchema), updateCustomerById)
router.delete('/:cid', authMdw, verifyAdminRoleMdw, validateParams(idParamSchema), deleteCustomerById)

export default router