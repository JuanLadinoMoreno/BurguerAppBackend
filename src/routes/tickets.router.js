import { Router } from "express";
import { getTickets,getSalesFromMonthYear, getSalesFromYear, getSalesForMonth, getSalesForCategoryMonth, getTopSellerProduct } from "../controllers/tickets.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del ticket
 *         cartId:
 *           type: string
 *           description: ID del carrito asociado
 *         totalPrice:
 *           type: number
 *           description: Precio total de la venta
 *         status:
 *           type: string
 *           enum: [completed, pending, canceled]
 *           description: Estado del ticket
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               precio:
 *                 type: number
 *           description: Lista de productos vendidos
 *         branch:
 *           type: string
 *           description: ID de la sucursal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del ticket
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         cartId: 507f1f77bcf86cd799439012
 *         totalPrice: 250.50
 *         status: completed
 *         products:
 *           - nombre: Hamburguesa Clásica
 *             cantidad: 2
 *             precio: 85
 *         branch: 507f1f77bcf86cd799439010
 *         createdAt: 2024-01-15T10:30:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 *
 *     SalesData:
 *       type: object
 *       properties:
 *         mes:
 *           type: string
 *           description: Mes o período
 *         totalVentas:
 *           type: number
 *           description: Total de ventas en el período
 *         cantidad:
 *           type: number
 *           description: Cantidad de transacciones
 *       example:
 *         mes: "Enero 2024"
 *         totalVentas: 5000.00
 *         cantidad: 25
 *
 *     SalesByCategoryData:
 *       type: object
 *       properties:
 *         categoria:
 *           type: string
 *           description: Categoría de producto
 *         mes:
 *           type: string
 *           description: Mes del período
 *         totalVentas:
 *           type: number
 *           description: Total de ventas en esa categoría
 *         cantidad:
 *           type: number
 *           description: Cantidad de productos vendidos
 *       example:
 *         categoria: comida
 *         mes: "Enero 2024"
 *         totalVentas: 2500.00
 *         cantidad: 15
 *
 *     TopSellerProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         cantidadVendida:
 *           type: number
 *           description: Cantidad total vendida
 *         totalVentas:
 *           type: number
 *           description: Monto total en ventas
 *         promedio:
 *           type: number
 *           description: Precio promedio de venta
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         nombre: Hamburguesa Clásica
 *         cantidadVendida: 150
 *         totalVentas: 12750.00
 *         promedio: 85.00
 */

/**
 * @swagger
 * tags:
 *   name: Tickets (Reports)
 *   description: API para gestión de tickets de venta y reportes de ventas (solo admin)
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtiene todos los tickets de venta
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     description: Obtiene el listado completo de tickets. Solo accesible para usuarios admin
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: No autorizado - se requiere autenticación
 *       403:
 *         description: Permiso denegado - se requiere rol de administrador
 */

/**
 * @swagger
 * /api/tickets/totalamount:
 *   get:
 *     summary: Obtiene ventas totales del año
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna el total de ventas acumuladas del año actual. Útil para dashboards y KPIs
 *     responses:
 *       200:
 *         description: Total de ventas obtenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVentas:
 *                   type: number
 *                   description: Monto total de ventas
 *                 cantidadTransacciones:
 *                   type: number
 *                   description: Cantidad total de transacciones
 *                 año:
 *                   type: number
 *                   description: Año del reporte
 *               example:
 *                 totalVentas: 50000.00
 *                 cantidadTransacciones: 400
 *                 año: 2024
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado - solo admin
 */

/**
 * @swagger
 * /api/tickets/totalamountmonth:
 *   get:
 *     summary: Obtiene resultados del mes en curso
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna el total de ventas y transacciones del mes actual
 *     responses:
 *       200:
 *         description: Datos del mes actual obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVentas:
 *                   type: number
 *                 cantidadTransacciones:
 *                   type: number
 *                 mes:
 *                   type: string
 *                 año:
 *                   type: number
 *               example:
 *                 totalVentas: 4500.00
 *                 cantidadTransacciones: 35
 *                 mes: "Noviembre"
 *                 año: 2024
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/tickets/salesforyear:
 *   get:
 *     summary: Obtiene ventas mensuales del año
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: Año del reporte (opcional, por defecto año actual)
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: ID de sucursal para filtrar (opcional)
 *     description: Retorna un desglose mensual de ventas. Permite filtrar por año y sucursal
 *     responses:
 *       200:
 *         description: Datos de ventas mensuales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesData'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/tickets/salescategorymonth:
 *   get:
 *     summary: Obtiene ventas por categoría y mes
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: Año del reporte (opcional)
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: ID de sucursal (opcional)
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [burguerP, bagP, sandP, hotdogP, burgerpP, burrP, bebidasF, bebidasC, snacksP]
 *         description: Tipo de producto (opcional)
 *     description: Proporciona un desglose detallado de ventas por categoría de producto y mes. Útil para análisis de desempeño por tipo de producto
 *     responses:
 *       200:
 *         description: Datos de ventas por categoría y mes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesByCategoryData'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

/**
 * @swagger
 * /api/tickets/topsellerproducts:
 *   get:
 *     summary: Obtiene productos más vendidos
 *     tags: [Tickets (Reports)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Cantidad de productos a retornar (opcional, máximo 50)
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: Año del reporte (opcional)
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: ID de sucursal (opcional)
 *     description: Retorna los productos con mayor cantidad de ventas. Ideal para identificar bestsellers y optimizar inventario
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos ordenados por cantidad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopSellerProduct'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */

const router = Router()
router.get('/', authMdw, verifyAdminRoleMdw, getTickets)
router.get('/totalamount', authMdw, verifyAdminRoleMdw, getSalesFromYear)//ventas totales
router.get('/totalamountmonth', authMdw, verifyAdminRoleMdw, getSalesFromMonthYear)//resultados del mes en curso
router.get('/salesforyear', authMdw, verifyAdminRoleMdw, getSalesForMonth)//busqueda por año y por  branch
router.get('/salescategorymonth', authMdw, verifyAdminRoleMdw, getSalesForCategoryMonth) //busqueda por año y por  branch y tipo(buuguerP)
router.get('/topsellerproducts', authMdw, verifyAdminRoleMdw, getTopSellerProduct)




export default router