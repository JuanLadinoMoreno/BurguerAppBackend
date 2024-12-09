import { Router } from "express";
import { getTickets,getSalesFromMonthYear, getSalesFromYear, getSalesForMonth } from "../controllers/tickets.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { verifyAdminRoleMdw } from "../middlewares/verifyRole.middleware.js";


const router = Router()
router.get('/', authMdw, verifyAdminRoleMdw, getTickets)
router.get('/totalamount', authMdw, verifyAdminRoleMdw, getSalesFromYear)
router.get('/totalamountmonth', authMdw, verifyAdminRoleMdw, getSalesFromMonthYear)
router.get('/salesformonth', authMdw, verifyAdminRoleMdw, getSalesForMonth)




export default router