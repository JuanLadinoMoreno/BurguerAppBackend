import BranchDAO from "../dao/mongo/branchs.dao.js";
import { BranchsDTO } from "../dto/branch.dto.js";
import CustomError from "./errors/CustomError.js";
import ErrorCodes from "./errors/errorCodes.js";

const branchDAO = new BranchDAO()

export class BranchService {


    async getBranch() {

        const products = await branchDAO.getBranch();
        if (!products) {
            return CustomError.createError({
                name: "ProductsNotFoundError",
                cause: '',
                message: "No se encontraron productos en la base de datos.",
                code: ErrorCodes.NOT_FOUND
            });
        }
        return products
        // return new BurgerDTO(products)
    }

    async createBranch(branch) {

        const branchCreate = await branchDAO.createBranch(branch)
        if (!branchCreate) {
            return CustomError.createError({
                name: 'ProductError',
                cause: '',
                message: 'Error to create product',
                code: ErrorCodes.EXISTING_DATA
            })

        }
        const prodCreadoDTO = new BranchsDTO(branchCreate)
        return prodCreadoDTO

    }
    
    async changeUserBranch(userId, branchId) {
        if (!userId || !branchId) {
            return CustomError.createError({
                name: 'BranchError',
                cause: '',
                message: 'Fields Empty',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        }

        // const products = await branchDAO.getBranch();
        // if (!products) {
        //     return CustomError.createError({
        //         name: "ProductsNotFoundError",
        //         cause: '',
        //         message: "No se encontraron productos en la base de datos.",
        //         code: ErrorCodes.NOT_FOUND
        //     });
        // }
        const result = await branchDAO.changeUserBranch(userId, branchId)
        if (!result) {
            return CustomError.createError({
                name: 'ProductError',
                cause: '',
                message: 'Error to create product',
                code: ErrorCodes.EXISTING_DATA
            })

        }
        return result
        // return new BurgerDTO(products)
    }
}