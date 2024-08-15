import mongoose from "mongoose";
// import CartsManager from "../dao/dbManager/CartsManager.js";
import CartsManager from "../dao/mongo/carts.dao.js";
import UserManager from "../dao/mongo/users.dao.js";
import { CartsService } from "../services/carts.services.js";
// import { usersService } from "../services/users.services.js";
import UsersService from "../services/users.services.js";



// import userModel from "../dao/mongo/models/user.model.js";

const cartsManager = new CartsManager()
const userManager = new UserManager()

const cartsService = new CartsService()
const usersService = new UsersService()



export const createCart = async (req, res, next) => {
    
    try {
        const usrId = new mongoose.Types.ObjectId(req.user.id)
        const cart = req.body
        
        const cartCreado = await cartsService.createCart(usrId, cart)
        
        if(!cartCreado){
            res.status(500).json({status: 'error', message: 'Error al crear producto'})
        }

        res.status(201).json({status: 'succes', payload: cartCreado})
    } catch (error) {
        next(error)
    }

}

export const getAllCarts = async (req, res) => {
    try {

        let limit = +req.query.limit
        const carts = await cartsService.getAllCarts()
        if (limit > 0) return res.json(carts.slice(0, limit))
        res.json({status: 'succes', payload: carts})

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const getUserCarts = async (req, res, next) => {
    try {
        
        const usrId = req.params.uid

        let limit = +req.query.limit
        const carts = await cartsService.getUserCarts(usrId)
        if (limit > 0) return res.json({status: 'success', payload: carts.slice(0, limit)} )
        res.json({status: 'success', payload: carts})

    } catch (error) {
        next(error)
    }

}


export const getCartById = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const cart = await cartsService.getCartById(cid)
        res.status(200).json({status: 'success', payload: cart})
    } catch (error) {
        // return res.status(500).json({ message: error.message });
        next(error)
    }
}

export const deleteCartById = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const cartDel = await cartsService.deleteCartById(cartId)

        if (!cartDel) return res.status(500).json({ payload: 'error', message: `Carrito con ID ${cartId} no fue posibles ser eliminado, verifique que exista` })

        res.status(200).json({ payload: 'seccess', message: `Carrito con ID ${cartId} eliminado exitosamente` })
    } catch (error) {
        next(error)
    }

}

export const empyCart = async (req, res, next) => {
    try {
        const cid = req.params.cid
        
        const empyCart = await cartsService.empyCart(cid);

        if (!empyCart) return res.status(500).json({ payload: 'error', message: `Carrito con ID ${cid} no fue posibles ser vaciado, verifique que exista` })
        
        res.status(200).json({ payload: 'seccess', message: `Carrito con ID ${cid} vaciado exitosamente` })
        
    } catch (error) {
        
        next(error)
    }
}

//Agrega producto al carrito
export const addProdororQuantToCart = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const { quantity } = req.body

        const prodCreado = await cartsService.addProductToCart(cid, pid, quantity)
        // if (!prodCreado) return res.status(500).json({ status:'error', message: 'error al actualizar carrito' })

        res.status(201).json({ status: 'success', payload: prodCreado})
    } catch (error) {
        console.log(error);
        next(error)
    }

}

export const updProductQuant = async (req, res) => {
    try {
        const cart = req.params.cid
        const product = req.params.pid

        const { quantity } = req.body

        console.log(cart, product);
        const prodCreado = await cartsManager.updQuantToProduct(cart, product, quantity)
        if (!prodCreado) return res.status(500).json({ message: 'error,producto o carrito no encontrado' })

        res.status(201).json(prodCreado)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const deleteProductCart = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const prodCreado = await cartsService.deleteProductCart(cid, pid)
        if (!prodCreado) return res.status(404).json({ status: 'error', message: 'error al eliminar el producto o el carrito no existe' })

        res.status(200).json({status: 'error', payload: prodCreado})
    } catch (error) {
        console.log(error);
        next(error)        
    }

}

export const finPurchase = async (req, res, next) => {
    try{
        const cid = req.params.cid
        const uid = req.user.id

        const ticket = await cartsService.finalizePurchase(cid, uid)        
        
        if(!ticket) return res.status(400).json({ status: 'seccess', message: 'Problem to create product.' })

         res.status(200).json({ status: 'seccess', payload: ticket })

    }catch(error){
        console.log(error);
        next(error)
    }
}