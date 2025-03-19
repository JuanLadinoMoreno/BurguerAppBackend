import categoriesModel from '../mongo/models/categories.models.js';
import productModel from '../mongo/models/products.model.js'


export default class productsDAO {

    

    async getProducts() {
        try {
            const productos = await productModel.find().populate('user');

            return productos.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log('Error al obtener los productos de la BD', error);
            return null
        }
    }

    async findProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id }).populate('user');

            if(!product) return null

            return product.toObject({ virtuals: true });
        } catch (error) {
            console.log(`Problemas al encontar producto con el ID: ${id}`, error);
            return null
        }
    }

    async findProductByIdd(id) {
        try {
            const product = await productModel.findOne({ _id: id });

            if(!product) return null

            return product
        } catch (error) {
            console.log('error  ->', error);
            return null
        }
    }

    async findProductByName(nombre) {
        try {
            const product = await productModel.findOne({ nombre: nombre });

            if (!product) return null

            return product.toObject({ virtuals: true });
        } catch (error) {
            console.log(error);
            return null
        }
    }



    // falata agregar los campos de producto
    async createProduct(produc) {
        try {
            
            return await productModel.create(produc)
            
        } catch (e) {
            console.log('Error al crear producto', e);
        }
    }
    
    async findByIdAndUpdate(id, product){
        try {
            return productModel.findByIdAndUpdate(id, { $set: product }, { returnDocument: 'after' })
        } catch (error) {
            console.log(error);
            
        }
    }

    async deleteProduct(id) {
        try {
            const prod = await productModel.findByIdAndDelete(id)
            return prod

        } catch (err) {
            console.log(err);
        }
    }

    async getProductsByCategory(ids){
        try {
            const productosByCategory = await  productModel.find({tipo: ids});
            return productosByCategory.map(p => p.toObject())
            
        } catch (error) {
            console.log(error);
        }
    }


    // llena menu de categorias
    async getCategories(){
        try {
            const categories = await  categoriesModel.find();
            // const categories = await  categoriesModel.find().sort({nombre: 1});
            return categories.map(p => p.toObject())
            
        } catch (error) {
            console.log(error);
        }
    }

    async updateStock(pid, quantity){
        try {
            return productModel.findByIdAndUpdate(pid, { $set: {stock: quantity} }, { new: true }) 
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo actualizar el stock del producto.");
        }
    }

    async updateStockQuantity(pid, quantity){
        try {
            return productModel.findByIdAndUpdate(pid, { $inc: {stock: -quantity} }, { new: true }) 
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo actualizar el stock del producto.");
        }
    }

    async updateAddStockQuantity(pid, quantity){
        try {
            return productModel.findByIdAndUpdate(pid, { $inc: {stock: quantity} }, { new: true }) 
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo actualizar el stock del producto.");
        }
    }

}