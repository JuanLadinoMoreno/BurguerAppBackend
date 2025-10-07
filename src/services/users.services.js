import moment from "moment";
import usersDAO from "../dao/mongo/users.dao.js";
import { usersDto } from "../dto/users.dto.js";
import bcryptjs from "bcryptjs";
import CustomError from "./errors/CustomError.js";
import { generateFindUserDataError, generateInvalidUserDataError } from "./errors/info.js";
import ErrorCodes from "./errors/errorCodes.js";
import { createAccessToken } from "../libs/jwts.js";
import transport from "../config/emailTransport.js";
import mongoose from "mongoose";

const UsersDAO = new usersDAO();

export default class usersService {


    async createUser(firstName, lastName, age, email, password, tipo, branch) {
        // try {


        if (!firstName ||
            !lastName ||
            !age ||
            age <= 0 ||
            !email ||
            !password ||
            !tipo ||
            !branch
        ) {
           throw CustomError.createError({
                name: 'UserDataError',
                cause: generateInvalidUserDataError({ firstName, lastName, age, email, password, tipo, branch }),
                message: 'Verifique los datos de usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const userExist = await UsersDAO.getUserByEmail(email);
        if (userExist) {
            // throw new Error('El usuario ya existe');

            throw CustomError.createError({
                name: 'ErrorUser',
                cause: '',
                message: 'El usuario ya esta registrado',
                code: ErrorCodes.EXISTING_DATA
            })

        }
        
        const pswHash = await bcryptjs.hash(password, 11)
        
        const usr = await UsersDAO.createUser(firstName, lastName, age, email, pswHash, tipo, branch)
        if (!usr) {
            throw CustomError.createError({
                name: 'ErrorUserCreated',
                cause: '',
                message: 'Error al crear usuario',
                code: ErrorCodes.INTERNAL_SERVER_ERROR
            })

        }

        const userDTO = new usersDto(usr)
        return userDTO
    }

    async onLogin(email, password) {
        // try {    


        if (!email || !password) {

            throw CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Error en email / contraseña, verifique datos',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }


        // const userFound = await userModel.findOne({ email });
        const userFound = await UsersDAO.getUserByEmail(email);

        if (!userFound) {
            throw CustomError.createError({
                name: 'UserDataError',
                cause: '',
                message: 'Usuario no registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {

            throw CustomError.createError({
                name: 'UserPasswordError',
                cause: '',
                message: 'Contraseña incorrecta',
                code: ErrorCodes.INVALID_CREDENTIALS
            })

        }

        // actualiza la fecha de ultima coneccion        
        const mome = moment();
        userFound.lastConnection = mome
        await userFound.save();

        const userDTO = new usersDto(userFound)
        return userDTO

    }


    async findUserById(id) {
            if (!id) {
                throw CustomError.createError({
                    name: 'UserDataError',
                    cause: '',
                    message: 'Verifique datos de usuario',
                    code: ErrorCodes.MISSING_REQUIRED_FIELDS
                })
    
            }
    
            const userFound = await UsersDAO.findUserById(id)
    
            if (!userFound) {
                throw CustomError.createError({
                    name: 'User data error',
                    cause: '',
                    message: 'User not found',
                    code: ErrorCodes.NOT_FOUND
                })
            }
    
            const userDTO = new usersDto(userFound)
            return userDTO
    }

    async updateUserById(id, user) {
        const uid = new mongoose.Types.ObjectId(id)

        await this.findUserById(uid)
        
        const userUpd = await UsersDAO.updateUserById(uid, user)
        
        if(!userUpd)
            throw CustomError.createError({
                name: 'Product update error',
                cause: '',
                message: 'El usuario no pudo ser actualizado',
                code: ErrorCodes.NOT_FOUND
            })
        const userUpdDTO = new usersDto(userUpd)
        return userUpdDTO
    }

    async getUsers(firstName, lastName, email) {

        const users = await UsersDAO.getUsers(firstName, lastName, email)
        if (!users) {
            throw CustomError.createError({
                name: 'UsersNotFound',
                cause: '',
                message: 'No se encontraron usuarios',
                code: ErrorCodes.NOT_FOUND
            });
        }
        return users

    }

    async deleteUserInactive(userId) {
        if (!userId) {
            throw CustomError.createError({
                name: 'UserIdError',
                cause: '',
                message: 'Verifique datos de usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        await this.findUserById(userId);

        const lastConnection = moment(userFound.lastConnection);

        const horasDif = moment().diff(lastConnection, 'hours');

        if (horasDif >= 1) {


            await transport.sendMail({
                from: 'juan',
                to: userFound.email,
                subject: "No te has conectado en las últimas 24 horas",
                html: `
                    <div>
                        <p>Hola ${userFound.firstName},</p>
                        <p>Notamos que no has iniciado sesión en la última hora. Si tienes algún problema, por favor contáctanos.</p>
                        <p>Saludos,</p>
                    </div>
                `,
                attachments: []
                // attachments: [
                //<img src='cid:meme1' /> esto va dentro del div para que salga la imagen

                //     {
                //         filename: 'meme.jpg',
                //         path: `${__dirname}/images/meme.jpg`,
                //         cid: 'meme1'
                //     }
                // ]
            })

            
        }

        return await UsersDAO.deleteUserById(userId);
    }

    async solicitudPaswordReset(email) {        

        if (!email) {
            throw CustomError.createError({
                name: 'EmailError',
                cause: '',
                message: 'Verifique que email sea correcto',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }
        
        const userFound = await UsersDAO.getUserByEmail(email)
        if (!userFound) {
            throw CustomError.createError({
                name: 'EmailError',
                cause: '',
                message: 'El amail no esta registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const token = await createAccessToken({ id: userFound.id }, '1d')

        //ojo
        const resetLink = `http://localhost:8080/reset-password`;

        await transport.sendMail({
            from: 'juan',
            to: userFound.email,
            subject: "Cambio de contraseña",
            html: `
                <div>
                    <p>Hola ${userFound.firstName},</p>
                    <p>Haga clic en el siguiente botón para restablecer su contraseña:</p>
                    <a href="${resetLink}" >Restablecer contraseña</a>
                </div>
            `,
            attachments: []
            // attachments: [
            //<img src='cid:meme1' /> esto va dentro del div para que salga la imagen

            //     {
            //         filename: 'meme.jpg',
            //         path: `${__dirname}/images/meme.jpg`,
            //         cid: 'meme1'
            //     }
            // ]
        })
        return token

    }

    async resetPassword(uid, password){
        if (!uid, !password) {
            throw CustomError.createError({
                name: 'UserDataError',
                cause: '',
                message: 'Verifique que los datos sean correctos',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }
        await this.findUserById(uid)
        
        const userReset = await UsersDAO.resetPassword(uid, password)

        if (!userReset) {
            throw CustomError.createError({
                name: 'ErrorPasswordData',
                cause: '',
                message: 'El amail no esta registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return userReset
        
    }

}
