import { Router} from "express";
import { createCart, deleteCartById, deleteProductCart, getCartById, getAllCarts, updProductQuant, getUserCarts, finPurchase, empyCart, addProdororQuantToCart, UpdateCartById, getCustomerCarts, UpdCartToCanceled, getTablesOccupied, getUserCartsInBranch, getAllUserCarts } from "../controllers/carts.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createCartsSchema } from "../validations/carts/create.schema.js";
import { updateCartsSchema, idParamSchema } from "../validations/carts/update.schema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del tamaño
 *         precio:
 *           type: number
 *           description: Precio del tamaño
 *       example:
 *         nombre: Mediana
 *         precio: 85
 *
 *     IngredienteExtra:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del ingrediente extra
 *         precio:
 *           type: number
 *           description: Precio del ingrediente extra
 *       example:
 *         nombre: Queso extra
 *         precio: 15
 *
 *     IngredienteRevolcado:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del ingrediente revolcado
 *         precio:
 *           type: number
 *           description: Precio del ingrediente revolcado
 *       example:
 *         nombre: Doritos
 *         precio: 10
 *
 *     ProductCart:
 *       type: object
 *       required:
 *         - pid
 *         - quantity
 *       properties:
 *         pid:
 *           type: string
 *           description: ID del producto (formato MongoDB)
 *         quantity:
 *           type: number
 *           description: Cantidad de productos
 *         ingredientesExtra:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IngredienteExtra'
 *           description: Ingredientes extra del producto
 *         selectedRevolcado:
 *           $ref: '#/components/schemas/IngredienteRevolcado'
 *           description: Ingrediente revolcado seleccionado
 *         size:
 *           $ref: '#/components/schemas/Size'
 *           description: Tamaño seleccionado
 *       example:
 *         pid: 507f1f77bcf86cd799439011
 *         quantity: 2
 *         size:
 *           nombre: Mediana
 *           precio: 85
 *         ingredientesExtra:
 *           - nombre: Queso extra
 *             precio: 15
 *         selectedRevolcado:
 *           nombre: Doritos
 *           precio: 10
 *
 *     Cart:
 *       type: object
 *       required:
 *         - products
 *         - totalPrice
 *         - branch
 *         - tableNumber
 *         - orderType
 *         - code
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del carrito
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductCart'
 *           description: Lista de productos en el carrito
 *         customer:
 *           type: string
 *           nullable: true
 *           description: ID del cliente (opcional)
 *         totalPrice:
 *           type: number
 *           description: Precio total del carrito
 *         branch:
 *           type: string
 *           description: ID de la sucursal
 *         tableNumber:
 *           type: number
 *           description: Número de mesa
 *         orderType:
 *           type: string
 *           enum: [dineIn, takeaway, delivery]
 *           description: Tipo de orden
 *         code:
 *           type: string
 *           description: Código de orden
 *         status:
 *           type: string
 *           enum: [active, completed, canceled]
 *           description: Estado del carrito
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         id: 507f1f77bcf86cd799439012
 *         products:
 *           - pid: 507f1f77bcf86cd799439011
 *             quantity: 2
 *             size:
 *               nombre: Mediana
 *               precio: 85
 *         customer: null
 *         totalPrice: 170
 *         branch: 507f1f77bcf86cd799439010
 *         tableNumber: 5
 *         orderType: dineIn
 *         code: ORD001
 *         status: active
 *         createdAt: 2024-01-15T10:30:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API para gestión de carritos de compra
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - totalPrice
 *               - branch
 *               - tableNumber
 *               - orderType
 *               - code
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - pid
 *                     - quantity
 *                   properties:
 *                     pid:
 *                       type: string
 *                       description: ID del producto
 *                     quantity:
 *                       type: number
 *                       description: Cantidad
 *                     size:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                         precio:
 *                           type: number
 *                     ingredientesExtra:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                           precio:
 *                             type: number
 *                     selectedRevolcado:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                         precio:
 *                           type: number
 *               customer:
 *                 type: string
 *                 nullable: true
 *                 description: ID del cliente (opcional)
 *               totalPrice:
 *                 type: number
 *                 description: Precio total
 *               branch:
 *                 type: string
 *                 description: ID de la sucursal
 *               tableNumber:
 *                 type: number
 *                 description: Número de mesa
 *               orderType:
 *                 type: string
 *                 description: Tipo de orden
 *               code:
 *                 type: string
 *                 description: Código de orden
 *             example:
 *               products:
 *                 - pid: 507f1f77bcf86cd799439011
 *                   quantity: 2
 *                   size:
 *                     nombre: Mediana
 *                     precio: 85
 *               totalPrice: 170
 *               branch: 507f1f77bcf86cd799439010
 *               tableNumber: 5
 *               orderType: dineIn
 *               code: ORD001
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtiene todos los carritos (solo admin)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado o permisos insuficientes
 */

/**
 * @swagger
 * /api/carts/tables-occupied:
 *   get:
 *     summary: Obtiene mesas ocupadas en la sucursal del usuario
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas ocupadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tableNumber:
 *                     type: number
 *                   branchId:
 *                     type: string
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/user/{uid}:
 *   get:
 *     summary: Obtiene carritos del usuario
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carritos del usuario obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/all/user/{uid}:
 *   get:
 *     summary: Obtiene todos los carritos del usuario (incluidos cancelados)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Todos los carritos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/user/{uid}/branch/{bid}:
 *   get:
 *     summary: Obtiene carritos del usuario en una sucursal específica
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal
 *     responses:
 *       200:
 *         description: Carritos en la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/customer/{cuid}:
 *   get:
 *     summary: Obtiene carritos de un cliente específico
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Carritos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */

/**
 * @swagger
 * /api/carts/{cid}/empty:
 *   put:
 *     summary: Vacía un carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualiza un carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               customer:
 *                 type: string
 *                 nullable: true
 *               totalPrice:
 *                 type: number
 *               branch:
 *                 type: string
 *               tableNumber:
 *                 type: number
 *               orderType:
 *                 type: string
 *             example:
 *               products: []
 *               totalPrice: 200
 *               tableNumber: 5
 *               orderType: dineIn
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */

/**
 * @swagger
 * /api/carts/cancel/{cid}:
 *   put:
 *     summary: Cancela un carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito cancelado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */

/**
 * @swagger
 * /api/carts/del/{cid}:
 *   delete:
 *     summary: Elimina un carrito (solo admin)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Carrito eliminado exitosamente
 *       401:
 *         description: No autorizado o permisos insuficientes
 *       404:
 *         description: Carrito no encontrado
 */

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   put:
 *     summary: Agrega producto al carrito o incrementa cantidad
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               size:
 *                 type: object
 *               ingredientesExtra:
 *                 type: array
 *               selectedRevolcado:
 *                 type: object
 *     responses:
 *       200:
 *         description: Producto agregado o cantidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito o producto no encontrado
 */

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito (solo admin)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado o permisos insuficientes
 *       404:
 *         description: Carrito o producto no encontrado
 */

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   get:
 *     summary: Finaliza la compra
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */

const router = Router()

router.post('/', authMdw, validateSchema(createCartsSchema), createCart)

router.get('/', authMdw, verifyAdminRoleMdw, getAllCarts)

//Obtiene las mesas disponibles en la sucuarsal del usuario
router.get('/tables-occupied',authMdw, getTablesOccupied)

//Obtiene carritos del usuario
router.get('/user/:uid', authMdw, getUserCarts)//

//Obtiene todos los carritos del usuario
router.get('/all/user/:uid', authMdw, getAllUserCarts)//

//Obtiene carritos del usuario en sucursal
router.get('/user/:uid/branch/:bid', authMdw, getUserCartsInBranch)//

//Obtiene carritos del usuario
router.get('/customer/:cuid', authMdw, getCustomerCarts)//

//Solo el usuario obtiene todos los carritos
router.get('/:cid', authMdw, getCartById)

//Vaciar carrito
router.put('/:cid/empty', authMdw, empyCart)

//Actualizar carrito
router.put('/:cid', authMdw, validateParams(idParamSchema), validateSchema(updateCartsSchema), UpdateCartById)

//Actualizar carrito a cancelado
router.put('/cancel/:cid', authMdw, UpdCartToCanceled)

//Solo el ususario admin puede eliminar un carrito
router.delete('/del/:cid', authMdw, verifyAdminRoleMdw, deleteCartById)

//Agrega producto al carrito si no existe, en caso de existir aumenta cantidad
router.put('/:cid/product/:pid', authMdw, addProdororQuantToCart)

//Actualiza cantidad de producto
// router.put('/:cid/product/:pid', authMdw, updProductQuant)

//elimina producto del carrito del usuario que lo creó
router.delete('/:cid/product/:pid', authMdw, verifyAdminRoleMdw, deleteProductCart)

//finaliza compra
router.get('/:cid/purchase', authMdw, finPurchase)

export default router