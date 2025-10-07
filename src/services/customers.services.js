import mongoose from "mongoose";
import CustomersDAO from "../dao/customers.dao.js";
import { customersDto } from "../dto/customers.dto.js";
import CustomError from "./errors/CustomError.js";
import ErrorCodes from "./errors/errorCodes.js";
import { generateInvalidUserDataError } from "./errors/info.js";


const customersDAO = new CustomersDAO()

export default class CustomersService {



    async createCustomer(firstName, lastName, phone, email) {
        // try {


        if (!firstName ||
            !lastName ||
            !phone ||
            !email
        ) {
            CustomError.createError({
                name: 'CustomerDataError',
                // cause: generateInvalidUserDataError({ firstName, lastName, phone, email }),
                cause: '',
                message: 'Verefique datos del cliente',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const customerExist = await customersDAO.getCustomerByEmail(email);
        if (customerExist) {
            // throw new Error('El usuario ya existe');

            CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'El cliente ya ha sido registrado',
                code: ErrorCodes.EXISTING_DATA
            })

        }

        const usr = await customersDAO.createCustomer(firstName, lastName, phone, email)
        const customerDTO = new customersDto(usr)
        return customerDTO

        // } catch (error) {
        //     console.log('Error al crear usuariodasdasdasdadad', error);
        //     return null
        // }
    }

    async getCustomers(firstName, lastName, email) {

        const customers = await customersDAO.getCustomers(firstName, lastName, email)
        if (!customers) {
            return CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'Problemas al obtener clientes',
                code: ErrorCodes.INVALID_CREDENTIALS
            })
        }

        return customers

    }

    async getCustomerById(id) {
        if (!id) {
            return CustomError.createError({
                name: 'CustomerDataError',
                cause: '',
                message: 'Verifique el id del usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        }

        const customerFound = await customersDAO.getCustomerById(id)

        if (!customerFound) {
            return CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'Error a obtener cliente',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const customerDTO = new customersDto(userFound)
        return customerDTO
    }

    async updateCustomerById(id, customer) {
        // try {
        const cid = new mongoose.Types.ObjectId(id)
        
        if(!id, !customer){

            return CustomError.createError({
                name: 'CustomerDataError',
                cause: '',
                message: 'Verifique los datos',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const customerFind = await customersDAO.getCustomerById(cid)

        if(!customerFind){

            return CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'El cliente no existe registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const customerUpd = await customersDAO.updateCustomerById(cid, customer)

        if (!customerUpd)
            return CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'El cliente no pudo ser actualizado',
                code: ErrorCodes.EXISTING_DATA
            })
        const customerUpdDTO = new customersDto(customerUpd)
        return customerUpdDTO
            
        // } catch (error) {
        //     console.log(error);
            
        // }
        
    }

    async deleteCustomerById(id) {
        if (!id) {
            return CustomError.createError({
                name: 'CustomerIdError',
                cause: '',
                message: 'Verifique el usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }
        const customerFound = await customersDAO.getCustomerById(id);
        if (!customerFound) {
            return CustomError.createError({
                name: 'CustomerError',
                cause: '',
                message: 'El cliente no existe registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }
        const customerDelete = await customersDAO.deleteCustomerById(id);
        if (!customerDelete) {
            return CustomError.createError({
                name: 'CustomerDeleteError',
                cause: '',
                message: 'Porblema al eliminar cliente',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return customerDelete
    }

}