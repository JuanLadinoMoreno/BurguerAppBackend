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
            CustomError.createError({
                name: 'User data error',
                cause: generateInvalidUserDataError({ firstName, lastName, age, email, password, tipo, branch }),
                message: 'Data error trying to create a new user',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const userExist = await UsersDAO.getUserByEmail(email);
        if (userExist) {
            // throw new Error('El usuario ya existe');

            CustomError.createError({
                name: 'Error register email user',
                cause: '',
                message: 'The user is already registered',
                code: ErrorCodes.EXISTING_DATA
            })

        }

        const pswHash = await bcryptjs.hash(password, 11)

        const usr = await UsersDAO.createUser(firstName, lastName, age, email, pswHash, tipo, branch)
        const userDTO = new usersDto(usr)
        return userDTO

        // } catch (error) {
        //     console.log('Error al crear usuariodasdasdasdadad', error);
        //     return null
        // }
    }

    async onLogin(email, password) {
        // try {    


        if (!email || !password) {

            CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'Error email / password, trying to login user',
                code: ErrorCodes.INVALID_CREDENTIALS
            })
        }


        // const userFound = await userModel.findOne({ email });
        const userFound = await UsersDAO.getUserByEmail(email);

        if (!userFound) {
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'User not found',
                code: ErrorCodes.INVALID_CREDENTIALS
            })
        }

        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {

            return CustomError.createError({
                name: 'User password error',
                cause: '',
                message: 'The password is not macth',
                code: ErrorCodes.IVALIT_CREDENTALS
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
                return CustomError.createError({
                    name: 'User id error',
                    cause: '',
                    message: 'Verify user',
                    code: ErrorCodes.IVALIT_CREDENTALS
                })
    
            }
    
            const userFound = await UsersDAO.findUserById(id)
    
            if (!userFound) {
                return CustomError.createError({
                    name: 'User data error',
                    cause: '',
                    message: 'User not found',
                    code: ErrorCodes.INVALID_CREDENTIALS
                })
            }
    
            const userDTO = new usersDto(userFound)
            return userDTO
    }

    async updateUserById(id, user) {
        const uid = new mongoose.Types.ObjectId(id)

        const userFind = await this.findUserById(uid)
        
        // if(!userFind){

        //     return CustomError.createError({
        //         name: 'Product data error',
        //         cause: '',
        //         message: 'The product is not exists',
        //         code: ErrorCodes.NOT_FOUND
        //     })
        // }
        
        const userUpd = await UsersDAO.updateUserById(uid, user)
        
        if(!userUpd)
            return CustomError.createError({
                name: 'Product update error',
                cause: '',
                message: 'The product can not be updated',
                code: ErrorCodes.EXISTING_DATA
            })
        const userUpdDTO = new usersDto(userUpd)
        return userUpdDTO
    }

    async getUsers() {

        const users = await UsersDAO.getUsers()
        return users

    }

    async deleteUserInactive(userId) {
        const userFound = await this.findUserById(userId);
        if (!userFound) {
            return CustomError.createError({
                name: 'User id error',
                cause: '',
                message: 'Verify user',
                code: ErrorCodes.IVALIT_CREDENTALS
            })
        }

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
        const userFound = await UsersDAO.getUserByEmail(email)
        if (!userFound) {
            return CustomError.createError({
                name: 'EmailError',
                cause: '',
                message: 'The email is not registered',
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
        return await UsersDAO.resetPassword(uid, password)
    }

}
