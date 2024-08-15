import mongoose from 'mongoose';
// import cartModel from './models/carts.model.js'
// import productsModel from './models/products.model.js'
import cartModel from './models/carts.model.js';
import productsModel from './models/products.model.js';
import ticketModel from './models/ticket.model.js';
import userModel from './models/user.model.js';
import { nanoid } from 'nanoid'


export default class CartsManager {


    async getCarts() {
        try {
            const carts = await cartModel.find().populate('products.pid')//.populate('user');
            // const carts = await cartModel.find().populate('products.pid')//.populate('user');
            // console.log('datos', productos)
            // return datos
            return carts.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log(error);
        }
    }

    async getUserCarts(usrId) {
        try {
            const carts = await cartModel.find({ user: usrId }).populate('products.pid')//.populate('user');
            // const carts = await cartModel.find().populate('products.pid')//.populate('user');
            // console.log('datos', productos)
            // return datos
            return carts.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findOne({ _id: id })//.populate('products.pid');
            // console.log('datos', productos)
            // return datos
            // return cart//.map(p => p.toObject({ virtuals: true }))            

            if (!cart) return null

            return cart//.toObject({ virtuals: true });

        } catch (error) {
            console.log(error);
        }
    }
    async getCartByIdStatusCreated(id) {
        try {
            const cart = await cartModel.findOne({ _id: id, status: 'created' })//.populate('products.pid');
            // console.log('datos', productos)
            // return datos
            // return cart//.map(p => p.toObject({ virtuals: true }))            

            if (!cart) return null

            return cart//.toObject({ virtuals: true });

        } catch (error) {
            console.log(error);
        }
    }

    async createCart(cart) {
        // console.log('cartCreate', cart );
        try {
            // this.validaDatos(cart);
            if (!cart) {
                console.log('ID del carrito no proporcionado');
                return null;
            }

            const car = await cartModel.create(cart)
            return car
        } catch (e) {
            console.log('Error al crear crearrito', e);
        }
    }

    async deleteCart(cid) {
        // console.log('cartCreate', cart );
        try {
    

            // Eliminar el carrito
            const deletedCart = await cartModel.findByIdAndDelete(cid);
            if (!deletedCart) return null


            // console.log(`Carrito con ID ${cid} eliminado exitosamente`);
            return deletedCart;

        } catch (e) {
            console.log('Error al eliminar el carrito', e);
            return null;
        }
    }

    async empyCart(cid, cart) {
        try {
            cart.products = []
            cart.status = 'empty'
            console.log('dao---------------->>', cart);

            return cartModel.findByIdAndUpdate(cid, { $set: cart }, { returnDocument: 'after' })
            // const empyCart = cart.save();
            // return empyCart

        } catch (error) {
            console.log('Error al vaciar el carrito', e);
            return null;
        }
    }

    async addCountToProductCart(cid, pid, quantity) {
        const productId = new mongoose.Types.ObjectId(pid); // Convierte pid a ObjectId
        try {

            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, 'products.pid': pid },
                { $inc: { 'products.$.quantity': quantity } }, // Incrementar la cantidad en 1
                { new: true }
            ).populate('products.pid'); // Asegúrate de que 'pid' se popule correctamente

            if (!cart) return null

            return cart
        } catch (error) {
            console.log('Error aquregar canidad', error);
            return null;
        }
    }

    async createProducInCart(cid, pid, quantity) {
        const productId = new mongoose.Types.ObjectId(pid); // Convierte pid a ObjectId
        try {
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid },
                { $push: { products: { pid: pid, quantity: quantity } } }, // Agregar nuevo producto con cantidad 1
                { new: true, upsert: true }
            ).populate('products.pid')

            if (!cart) return null

            return cart
        } catch (error) {
            console.log('Error al crear el producto', e);
            return null;
        }
    }

    async addProductToCart(cid, pid) {
        try {
  
            const productId = new mongoose.Types.ObjectId(pid); // Convierte pid a ObjectId
;

            let cart;
            if (existingProduct) {
                // suma cantidad
                cart = await cartModel.findOneAndUpdate(
                    { _id: cid, 'products.pid': productId },
                    { $inc: { 'products.$.quantity': 100 } }, // Incrementar la cantidad en 1
                    { new: true }
                ).populate('products.pid'); // Asegúrate de que 'pid' se popule correctamente
            } else {
                // crea carrito
                cart = await cartModel.findOneAndUpdate(
                    { _id: cid },
                    { $push: { products: { pid: productId, quantity: 1 } } }, // Agregar nuevo producto con cantidad 1
                    { new: true, upsert: true }
                ).populate('products.pid');
            }

         

            const cartF = await cartModel.findById(cid).populate('products.pid');

            return cart;
        } catch (e) {
            console.log('Error al crear carrito', e);
        }
    }


    async updQuantToProduct(cid, pid,quantity) {
        try {
            const carFind = await cartModel.findById(cid);
            const productFind = await productsModel.findById(pid);

            if (!carFind || !productFind) return null;

            const productId = new mongoose.Types.ObjectId(pid); // Convierte pid a ObjectId

            // Buscar si el producto ya está en el carrito
            const existingProduct = carFind.products.find(p => p.pid.equals(productId));

            let cart;
            if (existingProduct) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart = await cartModel.findOneAndUpdate(
                    { _id: cid, 'products.pid': productId },
                    { $inc: { 'products.$.quantity': quantity } }, // Incrementar la cantidad  ¿Duda en donde va a pasar la cantidad?
                    { new: true }
                ).populate('products.pid');
            } else {
                return null
            }



            const cartF = await cartModel.findById(cid)//.populate('products');
            return cart
        } catch (e) {
            console.log('Error al actualizar cantidad', e);
        }
    }

    async deleteProductCart(cart) {
        // console.log('cartCreate', cart );
        try {
            const updatedCart = await cart.save();

            return updatedCart

        } catch (e) {
            console.log('Error al eliminar el carrito', e);
            return null;
        }
    }

    async verifyCartOfUser(cid, uid) {
        try {
            // Verifica que el carrito exista y sea del usuario logeado
            const cart = await cartModel.findOne({ _id: cid, user: uid, status: 'created' }).populate('products.pid');
            return cart
        } catch (error) {
            console.log('Error: ', error);
            
        }
    }

    async productInStockSave(productInStock) {
        try {
            
            return await productInStock.save();
        } catch (error) {
            console.log('Error: ', error);
            return null
        }
    }

    async cartSave(cart) {
        try {
            return await cart.save();
        } catch (error) {
            console.log('Error: ', error);
            return null
        }
    }

    async UpdCartToFinalized(cid) {
        try {

            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { status: 'finalized' },
                { new: true }
            );

            if(updatedCart) return null

            return updatedCart   

        } catch (error) {
            console.log('Error: productInStockSave', error);
            return null
        }
    }

    async saveTicket(cantiadTotal, userEmail, uid, cid, productsSell) {
        try {
            const tiket = new ticketModel({
                code: nanoid(6), // Generar un código único para la compra
                amount: cantiadTotal,
                purchaser: userEmail, // Suponiendo que el usuario tiene un campo `email`
                user: uid,
                cart: cid,
                productsSell
            });
    
           return await tiket.save();
            
        } catch (error) {
            
        }
    }



    async finalizePurchase(cid, uid) {
        try {
            // Verifica que el carrito exista y sea del usuario logeado
            const cart = await cartModel.findOne({ _id: cid, user: uid, status: 'created' }).populate('products.pid');

            if (!cart) return null

            const insufficientStockProducts = [];
            let cantiadTotal = 0;
            let productInStock = null


            for (const product of cart.products) {
                productInStock = await productsModel.findById(product.pid);

                if (productInStock.stock < product.quantity) {
                    insufficientStockProducts.push({
                        pid: product.pid,
                        quantity: product.quantity,
                        stock: productInStock.stock
                    });
                } else {
                    productInStock.stock -= product.quantity;
                    await productInStock.save();
                    cantiadTotal += product.quantity * productInStock.precio;
                }
            }

            // if (insufficientStockProducts.length > 0) {
            // //   return {       ///OJO Como mandar el error de
            // //     message: 'Algunos productos no tienen suficiente stock.',
            // //     cart,
            // //     insufficientxStockProducts
            // //   };
            // return null
            // } else {        

            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { status: 'finalized' },
                { new: true }
            );

            //Guarda el cart los productos sin stock
            cart.products = insufficientStockProducts.map(p => ({
                pid: p.pid,
                quantity: p.quantity
            }));
            await cart.save();


            //   const usrId = new mongoose.Types.ObjectId(uid)
            const usrEmail = await userModel.findById(uid)

            // Crear y guardar el ticket de compra
            const tiket = new ticketModel({
                code: nanoid(6), // Generar un código único para la compra
                amount: cantiadTotal,
                purchaser: usrEmail.email, // Suponiendo que el usuario tiene un campo `email`
                user: cart.user._id,
                cart: cid
            });

            await tiket.save();
            //   await productInStock.save();

            return {
                message: 'Purchase finalized successfully.',
                cart: updatedCart,
                tiket,
                insufficientStockProducts
            };
            // }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}