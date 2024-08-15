
import ProductsCategoriesService from "../services/productsCategories.services.js";


const categoriesManager = new ProductsCategoriesService ()

export const getCatProducts = async (req, res) => {
    try{
        const products = await categoriesManager.getCategories();
        res.status(200).json(products)

    }catch(error){
        console.log(error);
        return res.status(500).json({status: error, message: error.message });        
    }


}