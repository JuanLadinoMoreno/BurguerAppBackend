import TicketsDAO from "../dao/mongo/tickets.dao.js"
import CustomError from "./errors/CustomError.js"
import ErrorCodes from "./errors/errorCodes.js"

const ticketsDAO = new TicketsDAO()

export default class TicketsServices{

    async getTickets() {
    
        const tickets = await ticketsDAO.getTickets()
        if (!tickets) {
            return CustomError.createError({
                name: 'Tickets Problem',
                cause: '',
                message: 'Problem to read tickets',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }

    async getSalesFromMonthYear() {
    
        const tickets = await ticketsDAO.getSalesFromMonthYear()
        if (!tickets) {
            return CustomError.createError({
                name: 'Tickets Problem',
                cause: '',
                message: 'Problem to read tickets',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }

    async getSalesFromYear() {
    
        const tickets = await ticketsDAO.getSalesFromYear()
        if (!tickets) {
            return CustomError.createError({
                name: 'Tickets Problem',
                cause: '',
                message: 'Problem to read tickets',
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
        
    
        const tickets = await ticketsDAO.getSalesForMonth(inicio, fin, branch)
        if (!tickets) {
            return CustomError.createError({
                name: 'Tickets Problem',
                cause: '',
                message: 'Problem to get sales for month',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }
    
    async getSalesForCategoryMonth(anio, branch, category) {
        
        const anioBuscar = anio.getUTCFullYear() || fechaActual.getUTCFullYear();

        const inicio = new Date(anioBuscar, 0, 1);
        const fin = new Date(anioBuscar + 1, 0, 1);
        
        if (!category) {
            return CustomError.createError({
                name: 'Category Problem',
                cause: '',
                message: 'Verify category are not empty',
                code: ErrorCodes.NOT_FOUND
            })

        }

        const tickets = await ticketsDAO.getSalesForCategoryMonth(inicio, fin, branch, category)
        if (!tickets) {
            return CustomError.createError({
                name: 'Tickets Problem',
                cause: '',
                message: 'Problem to get sales for month',
                code: ErrorCodes.NOT_FOUND
            })

        }
        return tickets
    
    }


}
