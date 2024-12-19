import { Router } from "express";
import { getBranch, createBranch, changeUserBranch } from "../controllers/branch.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";

const router = Router()

//Obtiene todas las sucursales
router.get('/', authMdw, getBranch);
//Crear sucursal
router.post('/', authMdw, createBranch);

router.patch('/users/:uid/sucursal', changeUserBranch);

export default router