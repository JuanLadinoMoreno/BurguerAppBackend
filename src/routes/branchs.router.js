import { Router } from "express";
import { getBranch, createBranch, changeUserBranch, getBranchAvailable, updateBranchById } from "../controllers/branch.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";

const router = Router()

//Obtiene todas las sucursales
router.get('/', authMdw, getBranch);
//Crear sucursal
router.post('/', authMdw, createBranch);
//Actualizar sucursal
router.put('/:bid', authMdw, updateBranchById);
//Obtiene todas las sucursales disponibles
router.get('/available', authMdw, getBranchAvailable);

router.patch('/users/:uid/sucursal', changeUserBranch);

export default router