import mongoose from "mongoose";
import { ProductsService } from "../services/products.services.js";


const productService = new ProductsService()


export const getProducts = async (req, res) => {
    try {
        
        let limit = +req.query.limit

        const products = await productService.getProducts();
        if(!products) return res.status(500).json({status: 'error', message: 'Products null'})
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
        console.log('product', product)
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({status: 'success', payload: product})
    } catch (error) {
        console.log('ksdljkfhsjkdhfakjgdfgkjhgk g');
        if (error.code === 7) {
            return res.status(404).json({ status: 'error', message: error.message });
        } 
        return res.status(500).json({status: error, message: error.message });
    }

}

export const createProduct = async (req, res, next) => {

    try {
    const id = req.user.id //poner para usuario
    
    const product = {...req.body, user: id}  //poner para usuario
    const prodCreado = await productService.createProduct(product);
    if (!prodCreado) return res.status(500).json({ status: "error", message: "Error al crear el producto" });
    
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
        if (!prodUpd) return res.status(500).json({ status: "error", message: "Error al actualizar el producto" });
        res.status(200).json({status: 'success', payload: prodUpd})        
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const prodDel = await productService.deleteOne(id)
        if (!prodDel) {
            return res.status(404).json({ status: 'error', message: 'Product not found' })
        }
        res.status(204).json({status: 'success', message: 'Producto eliminado'})
        
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
        if (!products) {
            return res.status(404).json({ status: 'error', message: 'Productos no encontrados' });
        }
        res.status(200).json({status: 'success', payload: products})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: error, message: error.message });
    }


}