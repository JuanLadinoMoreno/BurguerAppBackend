import ProductsDAO from "../dao/mongo/products.dao.js"
import CartsDAO from "../dao/mongo/carts.dao.js"
import UsersDAO from "../dao/mongo/users.dao.js"
import CustomError from "./errors/CustomError.js"
import ErrorCodes from "./errors/errorCodes.js"

import UsersService from "../services/users.services.js";

const usersDAO = new UsersDAO()
const cartsDAO = new CartsDAO()
const productsDAO = new ProductsDAO()

const usersService = new UsersService()

export class CartsService {

    async createCart(idUser, cart, customer, totalPrice) {

        // try {
        if (!idUser) {
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'Proporcione id',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        // if (!customer) {
        //     return CustomError.createError({
        //         name: 'Customer data error',
        //         cause: '',
        //         message: 'Proporcione customer',
        //         code: ErrorCodes.MISSING_REQUIRED_FIELDS
        //     })
        // }


        const findUser = await usersDAO.findUserById(idUser)
        if (!findUser) {
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'The user is not found',
                code: ErrorCodes.NOT_FOUND
            })
        }

        for (const product of cart.products) {
            let productInStock = await productsDAO.findProductById(product.pid);


            if (productInStock.stock < product.quantity) return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                // message: `Problema de stock ${productInStock.nombre}`,
                // message: `La cantidad ordenada (${product.quantity}) supera el stock disponible(${productInStock.stock}) para el producto ${productInStock.nombre}.`,
                message: `El producto ${productInStock.nombre} con cantidad ordenada (${product.quantity}) supera el stock disponible(${productInStock.stock}).`,
                code: ErrorCodes.OUT_OF_STOCK
            })

            const newStock = productInStock.stock - product.quantity;
            const prodUpdate = await productsDAO.updateStockQuantity(productInStock._id, product.quantity);
            if (!prodUpdate) {
                return CustomError.createError({
                    name: 'Cart data error',
                    cause: '',
                    message: `Problema al actualizar catidad en producto`,
                    code: ErrorCodes.NOT_FOUND
                })
            }

            // if (productInStock.stock < product.quantity) {
            //     insufficientStockProducts.push({
            //         pid: product.pid,
            //         quantity: product.quantity,
            //         stock: productInStock.stock
            //     });
            // } else {
            //     // prodsSell.push( product.pid)
            //     prodsSell.push({ product: product.pid, quantity: product.quantity })
            //     productInStock.stock -= product.quantity;
            //     // await productInStock.save();
            //     await cartsDAO.productInStockSave(productInStock)
            //     cantiadTotal += product.quantity * productInStock.precio;
            // }
        }

        const cartUsr = { ...cart, user: idUser, status: 'created', customer, totalPrice }



        const cartCreado = await cartsDAO.createCart(cartUsr)
        return cartCreado

    }


    async getAllCarts() {

        const carts = await cartsDAO.getCarts()
        if (!carts)
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'The user is not found',
                code: ErrorCodes.NOT_FOUND
            })
        return carts
    }

    async getUserCarts(uid) {

        const user = await usersService.findUserById(uid)
        if (!user)
            return CustomError.createError({
                name: 'User data error',
                cause: '',
                message: 'The user is not found',
                code: ErrorCodes.NOT_FOUND
            })
        const carts = await cartsDAO.getUserCarts(uid)
        return carts


    }

    async getCartById(cid) {

        const cart = await cartsDAO.getCartById(cid)
        if (!cart) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The cart is not found',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return cart

    }

    async deleteCartById(cid) {

        // Verificar que el ID del carrito no esté vacío
        if (!cid) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The cart is not found',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        // Verificar que el carrito exista en BD antes de intentar eliminarlo
        const carFind = await cartsDAO.getCartById(cartId);
        if (!carFind) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: `El carrito con ID ${cid} no existe`,
                code: ErrorCodes.NOT_FOUND
            })
        }
        // Elimina cart
        const cartDel = await cartsDAO.deleteCart(cid)
        // Verificar que la eliminación fue exitosa
        if (!cartDel) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: `Error al eliminar el carrito con ID ${cid}`,
                code: ErrorCodes.NOT_FOUND
            })
        }

        return cartDel;



    }

    async UpdateCartById(cid, cart, totalPrice) {

        if (!cid || !cart) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: `Error en los datos`,
                code: ErrorCodes.NOT_FOUND
            })
        }

        //Obtiene carrito de la bd
        const existingCart = await cartsDAO.getCartById(cid)
        if (!existingCart) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: `Carrito no encontrado`,
                code: ErrorCodes.NOT_FOUND
            })
        }

        for (const product of cart) {
            // let productInStock = await productsDAO.findProductByIdd(product.pid);


            // Buscar un producto coincidente en pid y propiedades adicionales
            const existingProduct = existingCart.products.find(p =>
                p.pid._id.toString() === product.pid &&
                (p.size?.id === product.size?.id) && //verifica que exista size ? y sea igual a id del productd ===
                (p.selectedRevolcado?.id === product.selectedRevolcado?.id) && //verifica que exista selectedRevolcado ? y sea igual a id del productd ===
                JSON.stringify(p.ingredientesExtra) === JSON.stringify(product.ingredientesExtra)
                // p.quantity !== product.quantity
            );


            // Si existe y coincide en propiedades, sumar cantidad adicional
            if (existingProduct) {


                if (existingProduct.quantity === product.quantity) {
                    //con cantidades iguales significa que si son objetos iguales, es decir que no se modifico en la orde
                    //por eso no hace nada y se pasa al siguiente
                    continue;
                }

                const calQuantity = existingCart.products.find(( prod ) => {
                    if (prod.pid._id.toString() === product.pid) {
    
                         const quant = product.quantity - prod.quantity
                    }
                });
                
                const additionalQuantity = product.quantity - existingProduct.quantity;

                // Validar stock para la cantidad adicional
                const stockCheck = await productsDAO.findProductByIdd(product.pid);

                if (stockCheck.stock < additionalQuantity) {
                    return CustomError.createError({
                        name: 'Cart update error',
                        cause: '',
                        message: `No hay suficiente stock para ${stockCheck.nombre}.`,
                        code: ErrorCodes.OUT_OF_STOCK
                    });
                }

                // Actualizar cantidad y reducir el stock
                const newStock = stockCheck.stock - additionalQuantity;

                const prodUpdate = await productsDAO.updateStock(stockCheck._id, newStock);
                if (!prodUpdate) {
                    return CustomError.createError({
                        name: 'Cart data error',
                        cause: '',
                        message: `Problema al actualizar catidad en producto`,
                        code: ErrorCodes.NOT_FOUND
                    })
                }
            } else {
                // Si no coincide en propiedades, agregar como nuevo producto
                const stockCheck = await productsDAO.findProductById(product.pid);
                if (stockCheck.stock < product.quantity) {
                    return CustomError.createError({
                        name: 'Cart update error',
                        cause: '',
                        message: `No hay suficiente stock para ${stockCheck.nombre}.`,
                        code: ErrorCodes.OUT_OF_STOCK
                    });
                }

                // Añadir al carrito y deducir stock
                const newStock = stockCheck.stock - product.quantity;

                const prodUpdate = await productsDAO.updateStockQuantity(stockCheck._id, product.quantity);
                if (!prodUpdate) {
                    return CustomError.createError({
                        name: 'Cart data error',
                        cause: '',
                        message: `Problema al actualizar catidad en producto`,
                        code: ErrorCodes.NOT_FOUND
                    })
                }
                // Añadir al carrito
                // existingCart.products.push(product);
            }

        }


        const updateCart = await cartsDAO.UpdateCartById(cid, cart, totalPrice)
        // const updateCart = await cartsDAO.UpdateCartById(cid, existingCart)
        // console.log('updateCart------ ', updateCart)

        return updateCart

    }

    async empyCart(cid) {
        if (!cid) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The cart is not found to empty',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const cartFind = await this.getCartById(cid)



        if (cartFind.products.length === 0 && cartFind.status === 'empty')
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'the card is already empty',
                code: ErrorCodes.NOT_FOUND
            })




        const empyCart = cartsDAO.empyCart(cid, cartFind)

        // if(!empyCart)
        //     return CustomError.createError({
        //         name: 'Cart data error',
        //         cause: '',
        //         message: 'The cart could not be emptied',
        //         code: ErrorCodes.INVALID_CREDENTIALS
        //     })
        return empyCart

    }

    async addProductToCart(cid, pid, quantity) {

        //verifica que el producto y el carrito existan
        const carFind = await cartsDAO.getCartByIdStatusCreated(cid);
        const productFind = await productsDAO.findProductById(pid);


        if (!carFind || !productFind)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Verifique datos a mandar',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })


        // // Buscar si el producto ya está en el carrito
        const existingProduct = carFind.products.find(p => p.pid.equals(pid));
        if (existingProduct) {
            const cartUpd = cartsDAO.addCountToProductCart(cid, pid, quantity)
            if (!cartUpd)
                return CustomError.createError({
                    name: 'Cart data error',
                    cause: '',
                    message: 'Error al actualizar catidad',
                    code: ErrorCodes.NOT_FOUND
                })
            return cartUpd
        } else {
            const cartUpd = cartsDAO.createProducInCart(cid, pid, quantity)
            if (!cartUpd)
                return CustomError.createError({
                    name: 'Cart data error',
                    cause: '',
                    message: 'Error to create product in cart',
                    code: ErrorCodes.NOT_FOUND
                })
            return cartUpd

        }

    }

    async updProductQuant(cid, pid) {
        const prodCreado = await cartsDAO.addCountToProductCart(cid, pid)


    }
    async deleteProductCart(cid, pid) {

        if (!cid || !pid)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Verifique datos a mandar',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const carFind = await this.getCartById(cid);


        const productFind = await productsDAO.findProductById(pid);

        if (!carFind || !productFind)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The card or product is not found',
                code: ErrorCodes.NOT_FOUND
            })

        // const productId = new mongoose.Types.ObjectId(pid); // Convierte pid a ObjectId
        // const cartId = new mongoose.Types.ObjectId(cid)

        // Buscar si el producto ya está en el carrito
        const productIndex = carFind.products.findIndex(p => p.pid.equals(pid));

        if (productIndex === -1) {
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The product is not exists in the cart',
                code: ErrorCodes.NOT_FOUND
            })
            // console.log(`El producto con ID ${pid} no se encuentra en el carrito`);
            // return null //code 404 ????
        }


        // Eliminar el producto del carrito
        carFind.products.splice(productIndex, 1);
        const updatedCart = await cartsDAO.deleteProductCart(carFind);
        // if(!updatedCart)
        //     return CustomError.createError({
        //         name: 'Cart data error',
        //         cause: '',
        //         message: 'Error al elimonar el producto del carrito',
        //         code: ErrorCodes.INVALID_CREDENTIALS
        //     })

        return updatedCart

    }

    async finalizePurchase(cid, uid) {
        // try {
        
        // Verifica que el carrito exista y sea del usuario logeado
        // const cart = await cartModel.findOne({ _id: cid, user: uid, status: 'created' }).populate('products.pid');
        const cart = await cartsDAO.verifyCartOfUser(cid, uid)
        if (!cart)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Cart not find or user have not permissions',
                code: ErrorCodes.INVALID_CREDENTIALS
            })

        // for (const product of cart.products) {
        //     productInStock = await productsDAO.findProductByIdd(product.pid);
        //     console.log('productInStock.stock < product.quantity', productInStock.stock, product.quantity);


        //     if (productInStock.stock < product.quantity) return CustomError.createError({
        //         name: 'Cart data error',
        //         cause: '',
        //         message: `Verificar el stock del producto ${productInStock.nombre}`,
        //         code: ErrorCodes.INVALID_CREDENTIALS
        //     })
        // }
        
        //Crae tiket en BD
        const customer = !cart.customer ? null : cart.customer._id
        const ticket = cartsDAO.saveTicket(cart.user._id, customer, cid, cart.products, cart.totalPrice)
        // uid, customer, cid, productsSell, cantidadTotal
        if (!ticket)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Error to create the tiket',
                code: ErrorCodes.INVALID_CREDENTIALS
            })

        //Actualiza el estado a Finalizado
        const updatedCart = cartsDAO.UpdCartToFinalized(cid)
        if (!updatedCart)
            return CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Error al actualizar a status: finalized ',
                code: ErrorCodes.INVALID_CREDENTIALS
            })

        await cartsDAO.cartSave(cart) //Guarda en BD
        
        return ticket
        // }

        // } catch (error) {
        //     console.error(error);
        //     // throw error;
        // }
    }
}