import categoriesModel from '../mongo/models/categories.models.js';
import productModel from '../mongo/models/products.model.js'


export default class productsDAO {

    

    async getProducts() {
        try {
            const productos = await productModel.find().populate('user');
            

            // Para traer productos creados por el usuario            
            // const productos = await productModel.find({ user: id}).populate('user');

            return productos.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log(error);
            return null
        }
    }

    async findProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id }).populate('user');

            if(!product) return null

            return product.toObject({ virtuals: true });
        } catch (error) {
            console.log('error  ->', error);
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

    // async deleteProduct(id = '6619a998eacc45356e34ea2c') {
    async deleteProduct(id) {
        try {
            
            const prod = await productModel.findByIdAndDelete(id)
            return prod

        } catch (err) {
            console.log(err);
            // return [];
        }
    }

    async getProductsByCategory(ids){
        try {
            const productosByCategory = await  productModel.find({tipo: ids});
            // console.log('datos', datos)
            // return datos
            return productosByCategory.map(p => p.toObject())
            
        } catch (error) {
            console.log(error);
        }
    }


    // llena menu de categorias
    async getCategories(){
        try {
            const categories = await  categoriesModel.find();
            return categories.map(p => p.toObject())
            
        } catch (error) {
            console.log(error);
        }
    }

}