import { Router } from "express";
import { authMdw } from "../middlewares/auth.middleware.js";
import { dash, deleteUserInactive, getUsers, getUsersById, login, logout, notifyInactiveUsers, register, resetPassword, solicitudPaswordReset, updateUser, verifyToken } from "../controllers/session.controller.js";


const router = Router()


router.post('/register', register)


router.post('/login', login);


//el middelware retorna al usuario que fue decodificado en JWT

router.post('/logout', logout)

router.get('/profile', authMdw, dash)

router.get('/verify', verifyToken);

router.get('/', getUsers)

router.get('/:uid', getUsersById)

router.put('/:uid', updateUser)

router.delete('/:uid', deleteUserInactive)

router.delete('/', notifyInactiveUsers)

//restableser conraseña
//crea token y manda correo
router.post('/req-reset-password', solicitudPaswordReset)
//verifica token y actualiza contraseña
router.post('/reset-password', resetPassword)

export default router
