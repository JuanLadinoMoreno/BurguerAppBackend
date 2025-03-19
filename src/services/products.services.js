
import ProductsDAO    from "../dao/mongo/products.dao.js";
import { BurgerDTO }    from "../dto/products.dto.js";
import ErrorCodes from "./errors/errorCodes.js";
import CustomError from "./errors/CustomError.js";
import mongoose from "mongoose";
import EmailService from "./email.services.js";

const productsDAO = new ProductsDAO();
const emailService = new EmailService()

export class ProductsService {

    validaDatos(produc) {
        // console.log('produc', produc);
        
        if (
            // (produc.ingrePrep === "" || !produc.ingrePrep) ||
            (produc.nombre === "" || !produc.nombre) ||
            // (produc.pan === "" || !produc.pan) ||
            (isNaN(produc.precio) || produc.precio < 0) ||
            // (produc.preparacion === "" || !produc.preparacion) ||
            (!produc.tipo || produc.tipo === "") ||
            ((produc.status != true && produc.status != false)) ||
            (isNaN(produc.stock) || produc.stock < 0)
        ) {
            console.log("Verifique que los campos esten coorectos o llenos");
            throw CustomError.createError({
                name: 'Product data error',
                cause: '',
                message: 'Verifique que los datos del producto sean correctos',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }
    }

    async getProducts ()  {        
       
            const products =  await productsDAO.getProducts();
            if (!products || products.length === 0) {
                throw CustomError.createError({
                    name: "ProductsNotFoundError",
                    cause: '',
                    message: "No se encontraron productos en la base de datos.",
                    code: ErrorCodes.NOT_FOUND
                });
            }
            return products
            // return new BurgerDTO(products)
    }

    
    async findProductById (id) {
        if(!id || id.trim() === "")
            throw CustomError.createError({
                name: 'ProductDataError',
                cause: '',
                message: 'Error en el id del producto',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

            const product = await productsDAO.findProductById(id)
            if(!product){

                throw CustomError.createError({
                    name: 'ProductNotFound',
                    cause: '',
                    message: 'El producto no existe',
                    code: ErrorCodes.NOT_FOUND
                })
            }
            return new BurgerDTO(product)
    }

    async createProduct(prod) {
            const veryUser = await productsDAO.findProductByName(prod.nombre)
            if(veryUser){
                throw CustomError.createError({
                    name: 'User error',
                    cause: '',
                    message: 'El nombre del producto ya existe',
                    code: ErrorCodes.EXISTING_DATA
                })      
 
            }

            this.validaDatos(prod);

            const prodCreado = await productsDAO.createProduct(prod)
            if(!prodCreado){
                throw CustomError.createError({
                    name: 'ProductError',
                    cause: '',
                    message: 'Error to create product',
                    code: ErrorCodes.INTERNAL_SERVER_ERROR
                })      
 
            }
            const prodCreadoDTO = new BurgerDTO(prodCreado)
            return prodCreadoDTO
            
    }
    
    async updateOne(pid, product) {
        
        this.validaDatos(product);
        
        if(!product || !pid){

            return CustomError.createError({
                name: 'UpdateDataError',
                cause: '',
                message: 'Verifique que el no falten datos',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }
        
        await this.findProductById(pid)
        
        const prodUpd = await productsDAO.findByIdAndUpdate(pid, product)
        
        if(!prodUpd)
            throw CustomError.createError({
                name: 'ProductUpdateError',
                cause: '',
                message: 'Error al actualizar el producto',
                code: ErrorCodes.INTERNAL_SERVER_ERROR
            })
        const prodUpdDTO = new BurgerDTO(prodUpd)
        return prodUpdDTO
    }

    async deleteOne(pid){
        await this.findProductById(pid)  

            // if(findProd.user.role === 'premium') {
            //     await emailService.notifyProductPremiumDelete(findProd)
            // }

        const prodDel = await productsDAO.deleteProduct(pid)
        
        if(!prodDel)
            return CustomError.createError({
                name: 'ProductDeleteError',
                cause: '',
                message: 'Problema al eliminar el producto',
                code: ErrorCodes.NOT_FOUND
            })

        return prodDel
    }

    async getProductsByCategory(id){
        if(!id || id.trim() === "")
            throw CustomError.createError({
                name: 'CategoryDataError',
                cause: '',
                message: 'Error en el id de la categoría',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        return productsDAO.getProductsByCategory(id)

    }
}