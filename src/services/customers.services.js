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
                name: 'Customer data error',
                // cause: generateInvalidUserDataError({ firstName, lastName, phone, email }),
                cause: '',
                message: 'Data error trying to create a new customer',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const userExist = await customersDAO.getCustomerByEmail(email);
        if (userExist) {
            // throw new Error('El usuario ya existe');

            CustomError.createError({
                name: 'Error register email customer',
                cause: '',
                message: 'The customer is already registered',
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

    async getCustomers() {

        const customers = await customersDAO.getCustomers()
        return customers

    }

    async getCustomerById(id) {
        if (!id) {
            return CustomError.createError({
                name: 'Customer id error',
                cause: '',
                message: 'Verify customer id',
                code: ErrorCodes.INVALID_CREDENTIALS
            })

        }

        const userFound = await customersDAO.getCustomerById(id)

        if (!userFound) {
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'User not found',
                code: ErrorCodes.INVALID_CREDENTIALS
            })
        }

        const customerDTO = new customersDto(userFound)
        return customerDTO
    }

    async updateCustomerById(id, customer) {
        // try {
        const cid = new mongoose.Types.ObjectId(id)

        const customerFind = await customersDAO.getCustomerById(cid)

        if(!customerFind){

            return CustomError.createError({
                name: 'Product data error',
                cause: '',
                message: 'The customer is not exists',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const customerUpd = await customersDAO.updateCustomerById(cid, customer)

        if (!customerUpd)
            return CustomError.createError({
                name: 'Product update error',
                cause: '',
                message: 'The product can not be updated',
                code: ErrorCodes.EXISTING_DATA
            })
        const customerUpdDTO = new customersDto(customerUpd)
        return customerUpdDTO
            
        // } catch (error) {
        //     console.log(error);
            
        // }
        
    }

    async deleteCustomerById(id) {
        const customerFound = await customersDAO.getCustomerById(id);
        if (!customerFound) {
            return CustomError.createError({
                name: 'User id error',
                cause: '',
                message: 'the user is not exist',
                code: ErrorCodes.INVALID_CREDENTIALS
            })
        }
        return await customersDAO.deleteCustomerById(id);
    }

}