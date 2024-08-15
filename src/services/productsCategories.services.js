import ProductsDAO from "../dao/mongo/products.dao.js";
import { ProductsCategoriesDTO } from "../dto/productsCategories.dto.js";
import CustomError from "./errors/CustomError.js";

const productsDAO = new ProductsDAO ()
// const prodDTO = new ProductsCategoriesDTO()

export default class ProductsCategoriesService {
    
    async getCategories(){
        try {
            const categories = await  productsDAO.getCategories()

            if (!categories)
                return CustomError.createError({
                    name: 'CategoriesError',
                    cause: '',
                    message: 'Problem to get categories',
                    code: ErrorCodes.NOT_FOUND
                })
                

            const products = categories.map(category => new ProductsCategoriesDTO(category));
            
            return products
        } catch (error) {
            console.log(error);
        }
    }

}