import TicketsServices from "../services/tickets.services.js";

const ticketsServices = new TicketsServices()

export const getTickets = async (req, res, next) => {
    try {
        const tickets = await ticketsServices.getTickets();
        if(!tickets) return res.json({status: 'error', message: 'Tickets null'})

        res.status(200).json({ status: 'success', payload: tickets })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const getSalesFromMonthYear = async (req, res, next) => {
    try {
        const tickets = await ticketsServices.getSalesFromMonthYear();
        if(!tickets) return res.json({status: 'error', message: 'Tickets null'})

        res.status(200).json({ status: 'success', payload: tickets })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const getSalesFromYear = async (req, res, next) => {
    try {
        const tickets = await ticketsServices.getSalesFromYear();
        if(!tickets) return res.json({status: 'error', message: 'Tickets null'})

        res.status(200).json({ status: 'success', payload: tickets })
    } catch (error) {
        console.log(error);

        next(error)
    }
}