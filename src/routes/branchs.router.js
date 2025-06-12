import { Router } from "express";
import { getBranch, createBranch, changeUserBranch, getBranchAvailable, updateBranchById } from "../controllers/branch.controller.js";
import { authMdw } from "../middlewares/auth.middleware.js";
import { validateSchema, validateParams } from "../middlewares/validatorSchema.middleware.js";
import { createBranchSchema } from "../validations/branchs/create.schema.js";
import { updateBranchSchema, idParamSchema } from "../validations/branchs/update.schema.js";

const router = Router()

//Obtiene todas las sucursales
router.get('/', authMdw, getBranch);
//Crear sucursal
router.post('/', authMdw, validateSchema(createBranchSchema), createBranch);
//Actualizar sucursal
router.put('/:bid', authMdw, validateParams(idParamSchema), validateSchema(updateBranchSchema), updateBranchById);
//Obtiene todas las sucursales disponibles
router.get('/available', authMdw, getBranchAvailable);

router.patch('/users/:uid/sucursal', changeUserBranch);

export default router