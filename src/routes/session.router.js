import { Router } from "express";
import { authMdw } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validatorSchema.middleware.js";
import { loginSchema } from "../validations/users/login.schema.js";
import { registerSchema } from "../validations/users/register.schema.js";
import { updateUserSchema } from "../validations/users/update.schema.js";
import { dash, deleteUserInactive, getUsers, getUsersById, login, logout, notifyInactiveUsers, register, resetPassword, solicitudPaswordReset, updateUser, verifyToken } from "../controllers/session.controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - age
 *         - email
 *         - password
 *         - role
 *         - branch
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario
 *         firstName:
 *           type: string
 *           description: Nombre del usuario
 *         lastName:
 *           type: string
 *           description: Apellido del usuario
 *         age:
 *           type: number
 *           description: Edad del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del usuario
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Rol del usuario
 *         branch:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: ID de la sucursal (ObjectId)
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         firstName: Juan
 *         lastName: Pérez
 *         age: 30
 *         email: juan@ejemplo.com
 *         password: password123
 *         role: user
 *         branch: 507f1f77bcf86cd799439012
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: number
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         branch:
 *           type: string
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         firstName: Juan
 *         lastName: Pérez
 *         age: 30
 *         email: juan@ejemplo.com
 *         role: user
 *         branch: 507f1f77bcf86cd799439012
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gestión de usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - age
 *               - email
 *               - password
 *               - role
 *               - branch
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               branch:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *             example:
 *               firstName: María
 *               lastName: González
 *               age: 25
 *               email: maria@ejemplo.com
 *               password: password123
 *               role: user
 *               branch: 676087e0765fe02a9c418f9c
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Validation error
 *               errors:
 *                 - Email is required zod
 *                 - Password must be at least 6 characters zod
 *       409:
 *         description: El email ya existe
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *             example:
 *               email: maria@ejemplo.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Usuario logeado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Validation error
 *               errors:
 *                 - Email is required zod
 *                 - Password must be at least 6 characters zod
 *       409:
 *         description: El email ya existe
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualiza completamente un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               - firstName
 *               - lastName
 *               - age
 *               - email
 *               - role
 *               - branch
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               branch:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *             example:
 *               firstName: María
 *               lastName: González
 *               age: 25
 *               role: admin
 *               branch: 676087e0765fe02a9c418f9c
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Cierra sesión de usuario
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/users/verify:
 *   get:
 *     summary: Verifica token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token válido
 */

/**
 * @swagger
 * /api/users/req-reset-password:
 *   post:
 *     summary: Solicita restablecimiento de contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Email de restablecimiento enviado
 *       404:
 *         description: Email no encontrado
 */

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Restablece contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               token: "token_aqui"
 *               newPassword: "nuevaPassword123"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Token inválido o expirado
 */

const router = Router()

router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)
router.post('/logout', logout)
router.get('/profile', authMdw, dash)
router.get('/verify', verifyToken)
router.get('/', getUsers)
router.get('/:uid', getUsersById)
router.put('/:uid', validateSchema(updateUserSchema), updateUser)
router.delete('/:uid', deleteUserInactive)
router.delete('/', notifyInactiveUsers)
router.post('/req-reset-password', solicitudPaswordReset)
router.post('/reset-password', resetPassword)

export default router
