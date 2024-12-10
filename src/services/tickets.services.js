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
    
    async getSalesForMonth() {
    
        const tickets = await ticketsDAO.getSalesForMonth()
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
    
    async getSalesForCategoryMonth(category) {
        
        if (!category) {
            return CustomError.createError({
                name: 'Category Problem',
                cause: '',
                message: 'Verify category are not empty',
                code: ErrorCodes.NOT_FOUND
            })

        }

        const tickets = await ticketsDAO.getSalesForCategoryMonth(category)
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
