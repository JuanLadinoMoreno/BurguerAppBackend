
import ProductsCategoriesService from "../services/productsCategories.services.js";


const categoriesManager = new ProductsCategoriesService ()

export const getCatProducts = async (req, res) => {
    try{
        const products = await categoriesManager.getCategories();
        if(!products) return res.status(404).json({status: 'error', message: 'Categorias no encontradas'})
        res.status(200).json({status: 'success', payload: products})

    }catch(error){
        console.log(error);
        return res.status(500).json({status: error, message: error.message });        
    }


}