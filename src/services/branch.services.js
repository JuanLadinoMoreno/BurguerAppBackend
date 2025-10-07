import BranchDAO from "../dao/mongo/branchs.dao.js";
import { BranchsDTO } from "../dto/branch.dto.js";
import CustomError from "./errors/CustomError.js";
import ErrorCodes from "./errors/errorCodes.js";

const branchDAO = new BranchDAO()

export class BranchService {


    async getBranch(name) {

        const branch = await branchDAO.getBranch(name);
        if (!branch) {
            return CustomError.createError({
                name: "ProductsNotFoundError",
                cause: '',
                message: "No se encontraron sucursales en la base de datos.",
                code: ErrorCodes.NOT_FOUND
            });
        }
        return branch
        // return new BurgerDTO(products)
    }

    async createBranch(branch) {

        if (!branch) {
            return CustomError.createError({
                name: 'BranchDataError',
                cause: '',
                message: 'Error en datos de sucursal',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        }
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

    async getBranchAvailable() {

        const branch = await branchDAO.getBranchAvailable();
        if (!branch) {
            return CustomError.createError({
                name: "BranchNotFoundError",
                cause: '',
                message: "No se encontraron sucursales en la base de datos.",
                code: ErrorCodes.NOT_FOUND
            });
        }
        return branch
    }

    async updateBranchById(bid, branch) {
        if(!bid || bid.trim() === "" || !branch)
            throw CustomError.createError({
                name: 'UpdateDataError',
                cause: '',
                message: 'Error en los datos de actualización',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        const branchFind = await branchDAO.getBranchById(bid)
        if (!branchFind) {

            return CustomError.createError({
                name: 'BranchNotFound',
                cause: '',
                message: 'La sucursal no existe',
                code: ErrorCodes.NOT_FOUND
            })
        }

        const branchUpd = await branchDAO.updateBranchById(bid, branch)
        if (!branchUpd)
            return CustomError.createError({
                name: 'Branch update error',
                cause: '',
                message: 'Problemas al actualizar la sucuesal',
                code: ErrorCodes.NOT_FOUND
            })
        
            const branchUpdDTO = new BranchsDTO(branchUpd)
            return branchUpdDTO
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
                message: 'No se pudo actualizar la sucursal del usuario',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return result
        // return new BurgerDTO(products)
    }
}