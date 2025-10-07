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