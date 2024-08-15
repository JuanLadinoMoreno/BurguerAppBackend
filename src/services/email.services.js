import moment from "moment";
import UsersDAO from "../dao/mongo/users.dao.js";
import CustomError from "./errors/CustomError.js";
import transport from "../config/emailTransport.js";

const usersDAO = new UsersDAO();


export default class EmailService{

    async notifyInactiveUsers() {
        // Obtiene todos los usuarios
        const allUsers = await usersDAO.getUsers();
        if (!allUsers) {
            return CustomError.createError({
                name: 'Users error',
                cause: '',
                message: 'Problem to get users',
                code: ErrorCodes.IVALIT_CREDENTALS
            })
        }

        // Filtra usuarios que no se han conectado en la última hora
        const inactiveUsers = allUsers.filter(user => {
            const lastConnection = moment(user.lastConnection);
            const hoursDiff = moment().diff(lastConnection, 'hours');
            return hoursDiff >= 1;
        });

        

        // Envia correos a los usuarios inactivos
        for (const user of inactiveUsers) {
            try {
                await transport.sendMail({
                    from: 'Juan ',
                    to: user.email,
                    subject: "Problemas de inactividad",
                    html: `
                        <div>
                            <p>Hola ${user.firstName},</p>
                            <p>Tu cuenta ha sido eliminada por inactividad.</p>
                            <p>Saludos</p>
                        </div>
                    `,
                    attachments: [] 
                });
            } catch (error) {
                console.error(`Error al enviar el correo`, error);
            }
          
            await usersDAO.deleteUserById(user._id);
        }

        return inactiveUsers;
    }


    async notifyProductPremiumDelete(prodDel) {        

            try {
                await transport.sendMail({
                    from: 'Juan ',
                    to: prodDel.user.email,
                    subject: "Producto eliminado",
                    html: `
                        <div>
                            <p>Hola ${prodDel.user.firstName},</p>
                            <p>Tu producto " ${prodDel.nombre} " ha sido eliminado.</p>
                            <p>Saludos</p>
                        </div>
                    `,
                    attachments: [] 
                });
            } catch (error) {
                console.error(`Error al enviar el correo`, error);
            }

    }
}