
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
            (produc.ingrePrep === "" || !produc.ingrePrep) ||
            (produc.nombre === "" || !produc.nombre) ||
            (produc.pan === "" || !produc.pan) ||
            (isNaN(produc.precio) || produc.precio < 0) ||
            (produc.preparacion === "" || !produc.preparacion) ||
            (!produc.tipo || produc.tipo === "") ||
            ((produc.status != true && produc.status != false)) ||
            (isNaN(produc.stock) || produc.stock < 0)
        ) {
            console.log("Verifique que los campos esten coorectos o llenos");
            return CustomError.createError({
                name: 'Product data error',
                cause: '',
                message: 'Verify that the fields are correct',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }
    }

    async getProducts ()  {        
       
            const products =  await productsDAO.getProducts();
            if (!products) {
                return CustomError.createError({
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
            const product = await productsDAO.findProductById(id)
            if(!product){

                return CustomError.createError({
                    name: 'Product data error',
                    cause: '',
                    message: 'The product is not exists',
                    code: ErrorCodes.NOT_FOUND
                })
            }
            return new BurgerDTO(product)
    }

    async createProduct(prod) {
            const veryUser = await productsDAO.findProductByName(prod.nombre)
            if(veryUser){
                return CustomError.createError({
                    name: 'User error',
                    cause: '',
                    message: 'The product name exists',
                    code: ErrorCodes.EXISTING_DATA
                })      
 
            }

            this.validaDatos(prod);

            const prodCreado = await productsDAO.createProduct(prod)
            if(!prodCreado){
                return CustomError.createError({
                    name: 'ProductError',
                    cause: '',
                    message: 'Error to create product',
                    code: ErrorCodes.EXISTING_DATA
                })      
 
            }
            const prodCreadoDTO = new BurgerDTO(prodCreado)
            return prodCreadoDTO
            
    }
    
    async updateOne(pid, product) {
        // const pid = new mongoose.Types.ObjectId(id)
        
        this.validaDatos(product);
        const productF = await this.findProductById(pid)
        if(!productF){

            return CustomError.createError({
                name: 'Product data error',
                cause: '',
                message: 'The product is not exists',
                code: ErrorCodes.NOT_FOUND
            })
        }
        
        const prodUpd = await productsDAO.findByIdAndUpdate(pid, product)
        
        if(!prodUpd)
            return CustomError.createError({
                name: 'Product update error',
                cause: '',
                message: 'The product can not be updated',
                code: ErrorCodes.EXISTING_DATA
            })
        const prodUpdDTO = new BurgerDTO(prodUpd)
        return prodUpdDTO
    }

    async deleteOne(pid){
        const findProd = await this.findProductById(pid)  
        if(!findProd)
            return CustomError.createError({
                name: 'Product data error',
                cause: '',
                message: 'The product is not exists',
                code: ErrorCodes.NOT_FOUND
            })

            if(findProd.user.role === 'premium') {
                await emailService.notifyProductPremiumDelete(findProd)
            }

        const prodDel = await productsDAO.deleteProduct(pid)
        
        if(!prodDel)
            return CustomError.createError({
                name: 'ProductError',
                cause: '',
                message: 'Problem to delete product',
                code: ErrorCodes.NOT_FOUND
            })

        return prodDel
    }

    async getProductsByCategory(id){
        return productsDAO.getProductsByCategory(id)
    }
}