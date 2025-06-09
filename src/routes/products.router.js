import { Router } from 'express'
import { authMdw } from '../middlewares/auth.middleware.js';
import { createProduct, deleteProduct, editProduct, getProductById, getProducts, getProductsByCat } from '../controllers/products.controller.js';
import { verifyAdminPremRoleMdw, verifyAdminRoleMdw } from '../middlewares/verifyRole.middleware.js';
import { validateSchema } from "../middlewares/validatorSchema.middleware.js";
import { createProductSchema } from "../validations/products/create.schema.js";



const router = Router()


//Obtiene todos los productos
router.get('/', authMdw, getProducts);

//Obtiene productos por id
router.get('/:id', authMdw,  getProductById);

//El usuario admin solo puede crear productos
router.post('/', authMdw, verifyAdminPremRoleMdw, validateSchema(createProductSchema), createProduct)

//El usuario admin solo puede actue productos
router.put('/:id', authMdw, verifyAdminRoleMdw, validateSchema(createProductSchema), editProduct)

//El usuario admin solo puede crear productos
router.delete('/:id', authMdw, verifyAdminPremRoleMdw, deleteProduct)


//Trae las categorias del los productos (hamburguesas) para llenar el menu de categorias
router.get('/category/:ids', getProductsByCat);


export default router
