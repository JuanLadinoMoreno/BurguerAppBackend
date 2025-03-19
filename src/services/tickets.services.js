import TicketsDAO from "../dao/mongo/tickets.dao.js"
import CustomError from "./errors/CustomError.js"
import ErrorCodes from "./errors/errorCodes.js"

const ticketsDAO = new TicketsDAO()

export default class TicketsServices{

    async getTickets() {
    
        const tickets = await ticketsDAO.getTickets()
        if (!tickets) {
            throw CustomError.createError({
                name: 'TicketsProblem',
                cause: '',
                message: 'Problema al obtener los tickets',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }

    async getSalesFromMonthYear() {
    
        const tickets = await ticketsDAO.getSalesFromMonthYear()
        if (!tickets) {
            throw CustomError.createError({
                name: 'SalesProblem',
                cause: '',
                message: 'Problema al obtener las ventas',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }

    async getSalesFromYear() {
    
        const tickets = await ticketsDAO.getSalesFromYear()
        if (!tickets) {
            throw CustomError.createError({
                name: 'SalesProblem',
                cause: '',
                message: 'Problema al obtener las ventas',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }
    
    async getSalesForMonth(anio, branch) {

        // Si no se envían mes y año, tomar el mes y año actuales
        const fechaActual = new Date();
        const anioBuscar = anio.getUTCFullYear() || fechaActual.getUTCFullYear();

        const inicio = new Date(anioBuscar, 0, 1);
        const fin = new Date(anioBuscar + 1, 0, 1);

        if (!branch) {
            throw CustomError.createError({
                name: 'BranchProblem',
                cause: '',
                message: 'Verifique que la sucursal exista',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        }        
    
        const tickets = await ticketsDAO.getSalesForMonth(inicio, fin, branch)
        if (!tickets) {
            throw CustomError.createError({
                name: 'SalesProblem',
                cause: '',
                message: 'Problema al obtener ventas por año - sucuarsal',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }
    
    async getSalesForCategoryMonth(anio, branch, category) {
        
        const anioBuscar = anio.getUTCFullYear() || fechaActual.getUTCFullYear();

        const inicio = new Date(anioBuscar, 0, 1);
        const fin = new Date(anioBuscar + 1, 0, 1);

        if (!branch || !category) {
            throw CustomError.createError({
                name: 'FieldsProblem',
                cause: '',
                message: 'Verifique que la sucursal y la categoria exista',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        }

        const tickets = await ticketsDAO.getSalesForCategoryMonth(inicio, fin, branch, category)
        if (!tickets) {
            throw CustomError.createError({
                name: 'SalesProblem',
                cause: '',
                message: 'Problema al obtener ventas por año - sucuarsal - categoria',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }


}
