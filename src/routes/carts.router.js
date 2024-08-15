import { Router} from "express";
import { createCart, deleteCartById, deleteProductCart, getCartById, getAllCarts, updProductQuant, getUserCarts, finPurchase, empyCart, addProdororQuantToCart } from "../controllers/carts.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";


const router = Router()

router.post('/', authMdw, createCart)

router.get('/', authMdw, verifyAdminRoleMdw, getAllCarts)

//Obtiene carritos del usuario
router.get('/user/:uid', authMdw, getUserCarts)//

//Solo el usuario admin obtiene todos los carritos
router.get('/:cid', authMdw, verifyAdminRoleMdw, getCartById)

//Vaciar carrito
router.put('/:cid', authMdw, empyCart)

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