import { Router } from "express";
import { deleteCustomerById, getCustomerById, getCustomers, register, updateCustomerById } from "../controllers/customers.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createSchema } from "../validations/customers/create.schema.js";
import { updateSchema, idParamSchema } from "../validations/customers/update.schema.js";



const router = Router()

router.post('/register', authMdw, verifyAdminRoleMdw, validateSchema(createSchema), register)
router.get('/', authMdw, getCustomers)
router.get('/:cid', authMdw, verifyAdminRoleMdw, getCustomerById)
router.put('/:cid', authMdw, verifyAdminRoleMdw, validateParams(idParamSchema), validateSchema(updateSchema), updateCustomerById)
router.delete('/:cid', authMdw, verifyAdminRoleMdw, deleteCustomerById)

export default router