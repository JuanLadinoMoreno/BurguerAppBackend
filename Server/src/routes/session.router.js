import { Router } from "express";
import { authMdw } from "../middlewares/auth.middleware.js";
import { dash, deleteUserInactive, getUsers, getUsersById, login, logout, notifyInactiveUsers, register, verifyToken } from "../controllers/session.controller.js";


const router = Router()


router.post('/register', register)


router.post('/login', login);


//el middelware retorna al usuario que fue decodificado en JWT

router.post('/logout', logout)

router.get('/profile', authMdw, dash)

router.get('/verify', verifyToken);

router.get('/', getUsers)

router.get('/:uid', getUsersById)

router.delete('/:uid', deleteUserInactive)

router.delete('/', notifyInactiveUsers)



export default router
