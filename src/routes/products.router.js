import { Router } from 'express'
import { authMdw } from '../middlewares/auth.middleware.js';
import { createProduct, deleteProduct, editProduct, getProductById, getProducts, getProductsByCat } from '../controllers/products.controller.js';
import { verifyAdminPremRoleMdw, verifyAdminRoleMdw } from '../middlewares/verifyRole.middleware.js';
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createProductSchema } from "../validations/products/create.schema.js";
import { updateProductSchema, idParamSchema } from "../validations/products/update.schema.js";



const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del tamaño
 *         precio:
 *           type: number
 *           description: Precio del tamaño
 *       example:
 *         nombre: Grande
 *         precio: 120
 *
 *     IngredienteExtra:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
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
 *       required:
 *         - nombre
 *         - precio
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
 *     Product:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - categoria
 *         - tipo
 *         - status
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: ID del producto
 *         aderesos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de aderezos disponibles
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         preparacion:
 *           type: string
 *           description: Instrucciones de preparación
 *         ingrePrep:
 *           type: string
 *           description: Ingredientes de preparación
 *         pan:
 *           type: string
 *           description: Tipo de pan
 *         precio:
 *           type: number
 *           description: Precio base del producto
 *         categoria:
 *           type: string
 *           enum: [comida, bebida, snack]
 *           description: Categoría del producto
 *         tipo:
 *           type: string
 *           enum: [burguerP, bagP, sandP, hotdogP, burgerpP, burrP, bebidasF, bebidasC, snacksP]
 *           description: Tipo específico del producto
 *         vegetales:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de vegetales incluidos
 *         status:
 *           type: boolean
 *           description: Estado del producto (activo/inactivo)
 *         stock:
 *           type: number
 *           description: Cantidad en stock
 *         tipoRevolcado:
 *           type: boolean
 *           default: false
 *           description: Si el producto puede llevar ingredientes revolcados
 *         ingredientesExtra:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IngredienteExtra'
 *           description: Lista de ingredientes extra disponibles
 *         ingredientesRevolcado:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IngredienteRevolcado'
 *           description: Lista de ingredientes revolcados disponibles
 *         tamanos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *           description: Tamaños disponibles del producto
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         aderesos: ["Mayonesa", "Ketchup", "Mostaza"]
 *         nombre: Hamburguesa Clásica
 *         preparacion: Carne a la parrilla con queso derretido
 *         ingrePrep: Carne de res, queso cheddar, lechuga, tomate
 *         pan: Integral
 *         precio: 85
 *         categoria: comida
 *         tipo: burguerP
 *         vegetales: ["Lechuga", "Tomate", "Cebolla"]
 *         status: true
 *         stock: 50
 *         tipoRevolcado: true
 *         ingredientesExtra:
 *           - nombre: Queso extra
 *             precio: 15
 *           - nombre: Tocino
 *             precio: 20
 *         ingredientesRevolcado:
 *           - nombre: Doritos
 *             precio: 10
 *         tamanos:
 *           - nombre: Mediana
 *             precio: 85
 *           - nombre: Grande
 *             precio: 120
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombre:
 *           type: string
 *         precio:
 *           type: number
 *         categoria:
 *           type: string
 *         tipo:
 *           type: string
 *         status:
 *           type: boolean
 *         stock:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gestión de productos
 */




/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [comida, bebida, snack]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [burguerP, bagP, sandP, hotdogP, burgerpP, burrP, bebidasF, bebidasC, snacksP]
 *         description: Filtrar por tipo
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado (activo/inactivo)
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error del servidor
 */
//Obtiene todos los productos
router.get('/', authMdw, getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del producto
 *       
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
//Obtiene productos por id
router.get('/:id', authMdw,  getProductById);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - categoria
 *               - tipo
 *               - status
 *               - stock
 *             properties:
 *               aderesos:
 *                 type: array
 *                 items:
 *                   type: string
 *               nombre:
 *                 type: string
 *               preparacion:
 *                 type: string
 *               ingrePrep:
 *                 type: string
 *               pan:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 enum: [comida, bebida, snack]
 *               tipo:
 *                 type: string
 *                 enum: [burguerP, bagP, sandP, hotdogP, burgerpP, burrP, bebidasF, bebidasC, snacksP]
 *               vegetales:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               tipoRevolcado:
 *                 type: boolean
 *                 default: false
 *               ingredientesExtra:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *               ingredientesRevolcado:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *               tamanos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *             example:
 *               aderesos: ["Mayonesa", "Ketchup", "Mostaza"]
 *               nombre: Hamburguesa Especial
 *               preparacion: Carne a la parrilla
 *               ingrePrep: Carne, queso, vegetales
 *               pan: Artesanal
 *               precio: 95
 *               categoria: comida
 *               tipo: burguerP
 *               vegetales: ["Lechuga", "Tomate", "Cebolla", "Pepinillos"]
 *               status: true
 *               stock: 30
 *               tipoRevolcado: true
 *               ingredientesExtra:
 *                 - nombre: Queso extra
 *                   precio: 15
 *                 - nombre: Tocino
 *                   precio: 20
 *               ingredientesRevolcado:
 *                 - nombre: Doritos
 *                   precio: 10
 *                 - nombre: Cheetos
 *                   precio: 10
 *               tamanos:
 *                 - nombre: Mediana
 *                   precio: 95
 *                 - nombre: Grande
 *                   precio: 130
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *                   - "Precio debe ser número positivo"
 *                   - "Categoria debe ser una categoría válida"
 *       401:
 *         description: No autorizado
 */
//El usuario admin solo puede crear productos
router.post('/', authMdw, verifyAdminPremRoleMdw, validateSchema(createProductSchema), createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             required:
 *               - nombre
 *               - precio
 *               - categoria
 *               - tipo
 *               - status
 *               - stock
 *             properties:
 *               aderesos:
 *                 type: array
 *                 items:
 *                   type: string
 *               nombre:
 *                 type: string
 *               preparacion:
 *                 type: string
 *               ingrePrep:
 *                 type: string
 *               pan:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 enum: [comida, bebida, snack]
 *               tipo:
 *                 type: string
 *                 enum: [burguerP, bagP, sandP, hotdogP, burgerpP, burrP, bebidasF, bebidasC, snacksP]
 *               vegetales:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               tipoRevolcado:
 *                 type: boolean
 *                 default: false
 *               ingredientesExtra:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *               ingredientesRevolcado:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *               tamanos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - precio
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *             example:
 *               aderesos: ["Mayonesa", "Ketchup", "Mostaza"]
 *               nombre: Hamburguesa Especial
 *               preparacion: Carne a la parrilla
 *               ingrePrep: Carne, queso, vegetales
 *               pan: Artesanal
 *               precio: 1095
 *               categoria: comida
 *               tipo: burguerP
 *               vegetales: ["Lechuga", "Tomate", "Cebolla", "Pepinillos"]
 *               status: true
 *               stock: 30
 *               tipoRevolcado: true
 *               ingredientesExtra:
 *                 - nombre: Queso extra
 *                   precio: 15
 *                 - nombre: Tocino
 *                   precio: 20
 *               ingredientesRevolcado:
 *                 - nombre: Doritos
 *                   precio: 10
 *                 - nombre: Cheetos
 *                   precio: 10
 *               tamanos:
 *                 - nombre: Mediana
 *                   precio: 95
 *                 - nombre: Grande
 *                   precio: 130
 *     responses:
 *       201:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *                   - "Precio debe ser número positivo"
 *                   - "Categoria debe ser una categoría válida"
 *       401:
 *         description: No autorizado
 */
//El usuario admin solo puede actue productos
router.put('/:id', authMdw, verifyAdminRoleMdw,validateParams(idParamSchema), validateSchema(updateProductSchema), editProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */

//El usuario admin solo puede crear productos
router.delete('/:id', authMdw, verifyAdminPremRoleMdw, deleteProduct)


//Trae las categorias del los productos (hamburguesas) para llenar el menu de categorias
router.get('/category/:ids', getProductsByCat);


export default router
