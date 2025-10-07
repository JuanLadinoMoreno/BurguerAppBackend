import mongoose from "mongoose";
import CartsManager from "../dao/mongo/carts.dao.js";
import { CartsService } from "../services/carts.services.js";
const cartsManager = new CartsManager()
const cartsService = new CartsService()



export const createCart = async (req, res, next) => {
    
    try {
        const usrId = new mongoose.Types.ObjectId(req.user.id)        
        
        const {products, customer, totalPrice, branch, tableNumber, orderType} = req.body
        
        const cartCreado = await cartsService.createCart(usrId, { products }, customer, totalPrice, branch, tableNumber, orderType)
        
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

        let { limit, start, end , branch, status, code, customer, user} = req.query
        const carts = await cartsService.getAllCarts(start, end , branch, status, code, customer, user )
        if (limit > 0) return res.json(carts.slice(0, limit))
        res.json({status: 'succes', payload: carts})

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const getUserCarts = async (req, res, next) => {
    try {
        
        const usrId = req.params.uid
        const { start, end, branch, status, limit, code } = req.query;

        const carts = await cartsService.getUserCarts(usrId, start, end, branch, status, code)
        if (limit > 0) return res.json({status: 'success', payload: carts.slice(0, limit)} )
        res.json({status: 'success', payload: carts})

    } catch (error) {
        next(error)
    }

}

export const getAllUserCarts = async (req, res, next) => {
    try {
        
        const usrId = req.params.uid

        let limit = +req.query.limit
        const carts = await cartsService.getAllUserCarts(usrId)
        if (limit > 0) return res.json({status: 'success', payload: carts.slice(0, limit)} )
        res.json({status: 'success', payload: carts})

    } catch (error) {
        next(error)
    }

}

export const getUserCartsInBranch = async (req, res, next) => {
    try {
        
        const usrId = req.params.uid
        const branchId = req.params.bid
        
        // const branchId = req.user.branch
        let limit = +req.query.limit
        const carts = await cartsService.getUserCartsInBranch(usrId, branchId)
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

export const UpdateCartById = async (req, res, next) => {
    
    try {
        const cid = req.params.cid       
        const {cart, totalPrice, orderType, tableNumber} = req.body
        
        
        const cartUpdated = await cartsService.UpdateCartById(cid, cart, totalPrice, orderType, tableNumber)
        
        // if(!cartUpdated){
        //     return res.status(500).json({status: 'error', message: 'Error al actualizar carrito'})
        // }

        res.status(201).json({status: 'succes', payload: cartUpdated})
    } catch (error) {        
        next(error)
    }

}

export const deleteCartById = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const cartDel = await cartsService.deleteCartById(cartId)
        res.status(200).json({ status: 'seccess', payload:cartDel, message: `Carrito con ID ${cartId} eliminado exitosamente` })
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
        next(error)
    }

}

export const updProductQuant = async (req, res) => {
    try {
        const cart = req.params.cid
        const product = req.params.pid

        const { quantity } = req.body

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
        res.status(204).json({status: 'error', payload: prodCreado})
    } catch (error) {
        next(error)        
    }

}

export const finPurchase = async (req, res, next) => {
    try{
        const cid = req.params.cid
        const uid = req.user.id

        const ticket = await cartsService.finalizePurchase(cid, uid)
         res.status(200).json({ status: 'seccess', payload: ticket })

    }catch(error){
        next(error)
    }
}

export const getCustomerCarts = async (req, res, next) => {
    try {
        
        const cuId = req.params.cuid

        let limit = +req.query.limit
        const carts = await cartsService.getCustomerCarts(cuId)
        // if (limit > 0) return res.json({status: 'success', payload: carts.slice(0, limit)} )
        res.status(200).json({status: 'success', payload: carts})

    } catch (error) {
        next(error)
    }

}

export const UpdCartToCanceled = async (req, res, next) => {
    try {
        const {cid} = req.params

        const cart = await cartsService.UpdCartToCanceled(cid)
        // if (limit > 0) return res.json({status: 'success', payload: carts} )
        // if (limit > 0) return res.json({status: 'success', payload: carts.slice(0, limit)} )
        res.status(201).json({status: 'success', payload: cart})

    } catch (error) {
        // console.log(error);
        
        next(error)
    }

}
//obtiene las mesas disponibles en la sucuarsal del usuario
export const getTablesOccupied = async (req, res, next) => {
    try {        
        const userId = new mongoose.Types.ObjectId(req.user.id)
        const tablesOccupied = await cartsService.getTablesOccupied(userId)
        res.status(200).json({status: 'success', payload: tablesOccupied})
    } catch (error) {
        // return res.status(500).json({ message: error.message });
        next(error)
    }
}

