import mongoose from "mongoose";
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

export const getSalesForMonth = async (req, res, next) => {
    try {
        const {anio, branch} = req.query
        console.log('branch', branch);        
        const branchId = new mongoose.Types.ObjectId(branch)
        const anioD = new Date(anio)
        // console.log('anio', anio);
        // console.log('ano', ano);
        
        const sales = await ticketsServices.getSalesForMonth(anioD, branchId);
        if(!sales) return res.json({status: 'error', message: 'Sales null'})

        res.status(200).json({ status: 'success', payload: sales })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const getSalesForCategoryMonth = async (req, res, next) => {
    try {
        // const {cid} = req.params
        const {cid, anio, branch} = req.query
        console.log('cid', cid);
        console.log('anio', anio);
        console.log('branch', branch);
        const branchId = new mongoose.Types.ObjectId(branch)
        // const cId = new mongoose.Types.ObjectId(cid)
        const anioD = new Date(anio)
        const sales = await ticketsServices.getSalesForCategoryMonth(anioD, branchId, cid);
        if(!sales) return res.json({status: 'error', message: 'Sales null'})

        res.status(200).json({ status: 'success', payload: sales })
    } catch (error) {
        console.log(error);

        next(error)
    }
}