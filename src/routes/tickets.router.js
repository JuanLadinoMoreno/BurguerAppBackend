import { Router } from "express";
import { getTickets,getSalesFromMonthYear, getSalesFromYear, getSalesForMonth, getSalesForCategoryMonth, getTopSellerProduct } from "../controllers/tickets.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";


const router = Router()
router.get('/', authMdw, verifyAdminRoleMdw, getTickets)
router.get('/totalamount', authMdw, verifyAdminRoleMdw, getSalesFromYear)//ventas totales
router.get('/totalamountmonth', authMdw, verifyAdminRoleMdw, getSalesFromMonthYear)//resultados del mes en curso
router.get('/salesforyear', authMdw, verifyAdminRoleMdw, getSalesForMonth)//busqueda por año y por  branch
router.get('/salescategorymonth', authMdw, verifyAdminRoleMdw, getSalesForCategoryMonth) //busqueda por año y por  branch y tipo(buuguerP)
router.get('/topsellerproducts', authMdw, verifyAdminRoleMdw, getTopSellerProduct)




export default router