import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";
import { createAccessToken } from "../libs/jwts.js";

import { TOKEN_SECRET } from "../config/config.js";

import UsersService from "../services/users.services.js";
import EmailService from "../services/email.services.js";

const usersService = new UsersService()
const emailService = new EmailService()

export const register = async (req, res, next) => {

    try {

        const { firstName, lastName, email, age, password, tipo, branch } = req.body

        const userFound = await usersService.createUser(firstName, lastName, age, email, password, tipo, branch)

        // const userFound = await userModel.findOne({ email });

        return res.status(200).json({
            status: 'success',
            payload: {
                id: userFound.id,
                fisrtsName: userFound.firstName,
                email: userFound.email,
            }
        });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // const userFound = await userModel.findOne({ email });
        const userFound = await usersService.onLogin(email, password)

        //crea token
        const token = await createAccessToken({ id: userFound.id }, '1d')
        //guarda token en cookie
        res.cookie("token", token, {
            // httpOnly: process.env.NODE_ENV !== "development",
            httpOnly: false,
            secure: true,
            sameSite: "none",
        })

        res.status(200).json({
            status: 'success',
            payload: {
                id: userFound.id,
                fisrtsName: userFound.firstName,
                email: userFound.email,
                branch:userFound.branch,
                role: userFound.role
            }
        });

    } catch (error) {
        next(error)
    }
}

export const logout = (req, res) => {
    try {

        res.cookie('token', "", {
            expires: new Date(0)
        }
        )
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
    }
}

export const dash = async (req, res, next) => {
    try {
        //piden datos del perfil del usuario
        const userFound = await usersService.findUserById(req.user.id);

        if (!userFound) return res.status(400).json({ message: 'User not found!' })


        return res.status(200).json({
            status: 'success',
            payload: {
                id: userFound.id,
                fisrtsName: userFound.firstName,
                email: userFound.email,
            }
        });

    } catch (error) {
        next(error)
    }
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401).json({ message: "No autorizado" });

        // const userFound = await userModel.findById(user.id);
        const userFound = await usersService.findUserById(user.id);
        if (!userFound) return res.sendStatus(401).json({ message: "No autorizado" });

        return res.status(200).json({
            status: 'success',
            payload: {
                id: userFound.id,
                fisrtsName: userFound.firstName,
                email: userFound.email,
                branch:userFound.branch,
                role: userFound.role
            }
        });
    });

}

export const getUsers = async (req, res, next) => {
    try {
        const users = await usersService.getUsers();
        res.status(200).json({ status: 'success', payload: users })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const getUsersById = async (req, res, next) => {
    try {
        const uid = req.params.uid
        const user = await usersService.findUserById(uid);
        res.status(200).json({ status: 'success', payload: user })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const uid = req.params.uid

        // const pid = new mongoose.Types.ObjectId(productId)
        const user = req.body
        const userUpd = await usersService.updateUserById(uid, user);

        res.status(201).json({ status: 'success', payload: userUpd })
    } catch (error) {
        next(error)
    }
}

export const deleteUserInactive = async (req, res, next) => {
    try {
        const uid = req.params.uid
        const user = await usersService.deleteUserInactive(uid);
        res.status(200).json({ status: 'success', payload: user })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

// 2024-08-13T19:21:04.068+00:00
export const notifyInactiveUsers = async (req, res, next) => {
    try {
        const users = await emailService.notifyInactiveUsers();

        res.status(200).json({ status: 'success', payload: users })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

//correo de recuperacion
export const solicitudPaswordReset = async (req, res, next) => {
    console.log('ksljdlfkjsdlfkjsldkjflkj');
    try {
        // const email = req.params.email
        const { email } = req.body
        const token = await usersService.solicitudPaswordReset(email)
        // if (!token)
        //     return res.status(500).json({ status: 'error', message: 'Error al solicitar cambio de contraseña' })


        res.cookie("tokenResetPass", token, {
            // httpOnly: process.env.NODE_ENV !== "development",
            httpOnly: false,
            secure: true,
            sameSite: "none",
        })
        return res.status(200).json({ status: 'success', message: 'Correo enviado con éxito' })

    } catch (error) {
        console.log('ksljdlfkjsdlfkjsldkjflkj', error);
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {

    const { tokenResetPass } = req.cookies;
    const { password } = req.body

    try {

        if (!tokenResetPass) return res.status(403).json({ message: "No token valid " });

        if (!password) return res.status(401).json({ message: "Password not be empy" });


        jwt.verify(tokenResetPass, TOKEN_SECRET, async (error, user) => {
            if (error) return res.status(401).json({ message: "El link ha caducado" });

            // const userFound = await userModel.findById(user.id);
            const userFound = await usersService.findUserById(user.id);
            if (!userFound) return res.status(401).json({ message: "No autorizado" });

            // const pswHash = await bcryptjs.hash(password, 11)
            const samePassword = await bcryptjs.compare(password, userFound.password);

            if (samePassword) return res.status(401).json({ message: "No puedes utilizar la misma contraseña" });

            const pswReset = usersService.resetPassword(userFound.id, password)

            if (!pswReset) return res.status(500).json({ status: 'error', message: 'Error al cambir de contraseña' })


            return res.status(200).json({
                status: 'success',
                message: 'Contraseña establecida con exito'
            });
        });

    } catch (error) {
        console.log(error)
        next(error)
    }



}