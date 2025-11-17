import { Router } from "express";
import { getUsers, register } from "../controllers/session.controller.js";
import { getBranch } from "../controllers/branch.controller.js";
import { llmAuthMdw, verifyLlmAdminRole } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validatorSchema.middleware.js";
import { registerSchema } from "../validations/users/register.schema.js";
import { getCustomers } from "../controllers/customers.controller.js";
import { getProducts } from "../controllers/products.controller.js";
import { getSalesForCategoryMonth, getSalesForMonth, getTickets, getTopSellerProduct } from "../controllers/tickets.controller.js";
import { getAllCarts, getCartById, getUserCarts } from "../controllers/carts.controller.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     scalekit:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Autenticación Scalekit para servidor MCP (Model Context Protocol)
 */

/**
 * @swagger
 * tags:
 *   name: LLM (MCP Server)
 *   description: API para servidor MCP con autenticación Scalekit. Estos endpoints son específicos para integración con servidores LLM mediante Model Context Protocol
 */

/**
 * @swagger
 * /api/llms/users:
 *   get:
 *     summary: Obtiene lista de usuarios
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener usuarios. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *       401:
 *         description: No autorizado - Token Scalekit inválido o expirado
 *       403:
 *         description: Permiso denegado - Scope 'usr:read' requerido
 */

/**
 * @swagger
 * /api/llms/users:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para registrar usuario. Requiere token Scalekit con scope 'usr:write' y rol admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             example:
 *               email: usuario@example.com
 *               password: Password123!
 *               firstName: Juan
 *               lastName: Pérez
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado - Requiere rol admin y scope 'usr:write'
 */

/**
 * @swagger
 * /api/llms/products:
 *   get:
 *     summary: Obtiene lista de productos
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener todos los productos. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   categoria:
 *                     type: string
 *                   stock:
 *                     type: number
 *       401:
 *         description: No autorizado - Token Scalekit inválido
 *       403:
 *         description: Permiso denegado - Scope 'usr:read' requerido
 */

/**
 * @swagger
 * /api/llms/branches:
 *   get:
 *     summary: Obtiene lista de sucursales
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener todas las sucursales. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de sucursales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   telefono:
 *                     type: string
 *       401:
 *         description: No autorizado - Token Scalekit inválido
 *       403:
 *         description: Permiso denegado - Scope 'usr:read' requerido
 */

/**
 * @swagger
 * /api/llms/clients:
 *   get:
 *     summary: Obtiene lista de clientes
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener todos los clientes. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *       401:
 *         description: No autorizado - Token Scalekit inválido
 *       403:
 *         description: Permiso denegado - Scope 'usr:read' requerido
 */

/**
 * @swagger
 * /api/llms/orders:
 *   get:
 *     summary: Obtiene todas las órdenes
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener todos los carritos/órdenes. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: No autorizado - Token Scalekit inválido
 *       403:
 *         description: Permiso denegado - Scope 'usr:read' requerido
 */

/**
 * @swagger
 * /api/llms/orders/{cid}:
 *   get:
 *     summary: Obtiene una orden específica
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito/orden
 *     description: Endpoint para obtener una orden específica. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 products:
 *                   type: array
 *                 totalPrice:
 *                   type: number
 *                 status:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 *       404:
 *         description: Orden no encontrada
 */

/**
 * @swagger
 * /api/llms/orders/user/{uid}:
 *   get:
 *     summary: Obtiene órdenes de un usuario específico
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     description: Endpoint para obtener órdenes de un usuario. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Órdenes del usuario obtenidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/llms/tickets:
 *   get:
 *     summary: Obtiene todos los tickets de venta
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener todos los tickets. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                   date:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/llms/sales/salesforyear:
 *   get:
 *     summary: Obtiene ventas del año
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener ventas mensuales del año actual. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Datos de ventas por mes obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mes:
 *                     type: string
 *                   totalVentas:
 *                     type: number
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/llms/sales/salescategorymonth:
 *   get:
 *     summary: Obtiene ventas por categoría y mes
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener ventas desglosadas por categoría y mes. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Datos de ventas por categoría y mes obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoria:
 *                     type: string
 *                   mes:
 *                     type: string
 *                   totalVentas:
 *                     type: number
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/llms/sales/topsellerproducts:
 *   get:
 *     summary: Obtiene productos más vendidos
 *     tags: [LLM (MCP Server)]
 *     security:
 *       - scalekit: []
 *     description: Endpoint para obtener los productos con mayor cantidad de ventas. Requiere token Scalekit con scope 'usr:read'
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   cantidadVendida:
 *                     type: number
 *                   totalVentas:
 *                     type: number
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

const router = Router()
//USUERS
router.get('/users', llmAuthMdw(['usr:read']), getUsers)
router.post('/users', llmAuthMdw(['usr:write']), verifyLlmAdminRole, validateSchema(registerSchema), register)

//PRODUCTS
router.get('/products', llmAuthMdw(['usr:read']), getProducts)

//BRANCHES
router.get('/branches', llmAuthMdw(['usr:read']), getBranch)

//CUSTOMERS
router.get('/clients', llmAuthMdw(['usr:read']), getCustomers)

//ORDERS
router.get('/orders', llmAuthMdw(['usr:read']), getAllCarts)
router.get('/orders/:cid', llmAuthMdw(['usr:read']), getCartById)
router.get('/orders/user/:uid', llmAuthMdw(['usr:read']), getUserCarts)

//SALES
router.get('/tickets', llmAuthMdw(['usr:read']), getTickets)
router.get('/sales/salesforyear', llmAuthMdw(['usr:read']), getSalesForMonth)
router.get('/sales/salescategorymonth', llmAuthMdw(['usr:read']), getSalesForCategoryMonth)
router.get('/sales/topsellerproducts', llmAuthMdw(['usr:read']), getTopSellerProduct)



export default router