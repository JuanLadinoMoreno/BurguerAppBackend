import { Router } from "express";
import { deleteCustomerById, getCustomerById, getCustomers, register, updateCustomerById } from "../controllers/customers.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";



const router = Router()

router.post('/register', authMdw, verifyAdminRoleMdw, register)
router.get('/', authMdw, verifyAdminRoleMdw, getCustomers)
router.get('/:cid', authMdw, verifyAdminRoleMdw, getCustomerById)
router.put('/:cid', authMdw, verifyAdminRoleMdw, updateCustomerById)
router.delete('/:cid', authMdw, verifyAdminRoleMdw, deleteCustomerById)

export default router