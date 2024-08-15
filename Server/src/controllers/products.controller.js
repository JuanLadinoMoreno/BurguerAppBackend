import mongoose from "mongoose";
import { ProductsService } from "../services/products.services.js";


const productService = new ProductsService()


export const getProducts = async (req, res) => {
    try {
        
        let limit = +req.query.limit

        const products = await productService.getProducts();
        if(!products) return res.json({status: 'error', message: 'Products null'})
        // console.log('get products', products);
        if (limit > 0) return res.json(products.slice(0, limit))

        res.status(200).json({status: 'success', payload: products})
    } catch (error) {
        return res.status(500).json({ status: error,  message: error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id
        const product = await productService.findProductById(id)
        res.status(200).json({status: 'success', payload: product})
    } catch (error) {
        return res.status(500).json({status: error, message: error.message });
    }

}

export const createProduct = async (req, res, next) => {

    try {
    const id = req.user.id //poner para usuario
    
    const product = {...req.body, user: id}  //poner para usuario
    const prodCreado = await productService.createProduct(product);
    
    res.status(201).json({status: 'success', payload: prodCreado})
    } catch (error) {
        next(error)
    }
    
}

export const editProduct = async (req, res, next) => {
    try {
        const pid = req.params.id
        
        // const pid = new mongoose.Types.ObjectId(productId)
        const product = req.body
        const prodUpd = await productService.updateOne(pid, product);
        
        res.status(201).json({status: 'success', payload: prodUpd})        
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const prodDel = await productService.deleteOne(req.params.id)
        if (!prodDel) {
            return res.status(404).json({ status: 'error', message: 'Product not found' })
        }
        //204?
        res.status(200).json({status: 'success', message: 'Producto eliminado'})
        
    } catch (error) {
        console.log(error);
        next(error)
    }

}

export const getProductsByCat = async (req, res) => {
    // let limit = +req.query.limit
    try {
        const ids = req.params.ids
        const products = await productService.getProductsByCategory(ids);
    
        res.status(200).json({status: 'success', payload: products})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: error, message: error.message });
    }


}