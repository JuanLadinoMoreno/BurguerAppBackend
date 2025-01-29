import { Router} from "express";
import { createCart, deleteCartById, deleteProductCart, getCartById, getAllCarts, updProductQuant, getUserCarts, finPurchase, empyCart, addProdororQuantToCart, UpdateCartById, getCustomerCarts, UpdCartToCanceled, getTablesOccupied, getUserCartsInBranch, getAllUserCarts } from "../controllers/carts.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";


const router = Router()

router.post('/', authMdw, createCart)

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
router.put('/:cid', authMdw, empyCart)

//Actualizar carrito
router.put('/', authMdw, UpdateCartById)

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