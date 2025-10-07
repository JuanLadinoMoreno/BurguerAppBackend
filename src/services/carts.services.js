import ProductsDAO from "../dao/mongo/products.dao.js"
import CartsDAO from "../dao/mongo/carts.dao.js"
import UsersDAO from "../dao/mongo/users.dao.js"
import CustomError from "./errors/CustomError.js"
import ErrorCodes from "./errors/errorCodes.js"

import UsersService from "../services/users.services.js";
import transport from "../config/emailTransport.js"

import { templateHtmlCarrito } from "../templates/emailTicket.js"

const usersDAO = new UsersDAO()
const cartsDAO = new CartsDAO()
const productsDAO = new ProductsDAO()

const usersService = new UsersService()

export class CartsService {

    async createCart(idUser, cart, customer, totalPrice, branch, tableNumber, orderType) {

        // try {
        if (!idUser || !cart || !totalPrice || !branch || !orderType ) {
            throw CustomError.createError({
                name: 'CartDataError',
                cause: '',
                message: 'Verifique que los datos el carrito existan',
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
            throw CustomError.createError({
                name: 'UserError',
                cause: '',
                message: 'El usuario no se encuentra registrado',
                code: ErrorCodes.NOT_FOUND
            })
        }

        if (orderType === 'En mesa' && !tableNumber) {
            throw CustomError.createError({
                name: 'OrderTableProblem',
                cause: '',
                message: 'Para ordenar en mesa es obligatorio numero de mesa',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }



        if (tableNumber && tableNumber !== 0) {

            const findTable = await cartsDAO.getCartInTable(tableNumber, findUser.branch._id)

            if (findTable.length > 0) {
                throw CustomError.createError({
                    name: 'Cart table error',
                    cause: '',
                    message: `La mesa número ${tableNumber} ya está ocupada.`,
                    code: ErrorCodes.EXISTING_DATA
                })
            }
        }



        for (const product of cart.products) {
            let productInStock = await productsDAO.findProductById(product.pid);


            if (productInStock.stock < product.quantity) throw CustomError.createError({
                name: 'CartStockError',
                cause: '',
                message: `El producto ${productInStock.nombre} con cantidad ordenada (${product.quantity}) supera el stock disponible(${productInStock.stock}).`,
                code: ErrorCodes.OUT_OF_STOCK
            })

            const newStock = productInStock.stock - product.quantity;
            const prodUpdate = await productsDAO.updateStockQuantity(productInStock._id, product.quantity);
            if (!prodUpdate) {
                throw CustomError.createError({
                    name: 'CartStockError',
                    cause: '',
                    message: `Problema al actualizar catidad en producto`,
                    code: ErrorCodes.NOT_FOUND
                })
            }
        }

        const code = Math.floor(Math.random() * 1000000);
        const cartUsr = { ...cart, user: idUser, status: 'created', customer, totalPrice, branch, tableNumber, orderType, code}



        const cartCreado = await cartsDAO.createCart(cartUsr)
        if (!cartCreado) {
            throw CustomError.createError({
                name: 'CartCreateError',
                cause: '',
                message: `Problema al crear el carrito`,
                code: ErrorCodes.INTERNAL_SERVER_ERROR
            })
        }
        return cartCreado

    }


    async getAllCarts(start, end , branch, status, code, customer, user ) {

        const carts = await cartsDAO.getCarts(start, end , branch, status, code, customer, user )
        if (!carts)
            throw CustomError.createError({
                name: 'CartsNotFoundError',
                cause: '',
                message: 'No hay carritos disponibles',
                code: ErrorCodes.NOT_FOUND
            })
        return carts
    }

    async getUserCarts(uid, start, end, branch, status, code) {

        if (!uid)
            throw CustomError.createError({
                name: 'UserDataError',
                cause: '',
                message: 'Verificar usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const user = await usersService.findUserById(uid)
        if (!user)
            throw CustomError.createError({
                name: 'UserError',
                cause: '',
                message: 'El usuario no existe',
                code: ErrorCodes.NOT_FOUND
            })
        const carts = await cartsDAO.getUserCarts(uid, start, end, branch, status, code)
        if (!carts)
            throw CustomError.createError({
                name: 'UserError',
                cause: '',
                message: 'No hay carritos con ese cliente',
                code: ErrorCodes.NOT_FOUND
            })
        return carts


    }
    async getAllUserCarts(uid) {
        if (!uid)
            throw CustomError.createError({
                name: 'UserDataError',
                cause: '',
                message: 'Verificar usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const user = await usersService.findUserById(uid)
        if (!user)
            throw CustomError.createError({
                name: 'UserError',
                cause: '',
                message: 'El usuario no existe',
                code: ErrorCodes.NOT_FOUND
            })
        const carts = await cartsDAO.getAllUserCarts(uid)
        if (!carts)
            throw CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'No hay carritos ',
                code: ErrorCodes.NOT_FOUND
            })
        return carts


    }

    async getUserCartsInBranch(uid, bid) {

        if (!uid || !bid)
            throw CustomError.createError({
                name: 'DataError',
                cause: '',
                message: '',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const user = await usersService.findUserById(uid)
        if (!user)
            throw CustomError.createError({
                name: 'UserError',
                cause: '',
                message: 'El usuario no existe',
                code: ErrorCodes.NOT_FOUND
            })
        const carts = await cartsDAO.getUserCartsInBranch(uid, bid)
        if (!carts)
            throw CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'No hay carritos ',
                code: ErrorCodes.NOT_FOUND
            })
        return carts


    }

    async getCartById(cid) {

        if (!cid) {
            throw CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verificar carrito existente',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const cart = await cartsDAO.getCartById(cid)
        if (!cart) {
            return CustomError.createError({
                ame: 'CartError',
                cause: '',
                message: 'No hay carritos ',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return cart

    }

    async deleteCartById(cid) {

        // Verificar que el ID del carrito no esté vacío
        if (!cid) {
            return CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verificar datos ',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        // Verificar que el carrito exista en BD antes de intentar eliminarlo
        const carFind = await cartsDAO.getCartById(cartId);
        if (!carFind) {
            return CustomError.createError({
                name: 'CartError',
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

    async UpdateCartById(cid, cart, totalPrice, orderType, tableNumber) {
        console.log(cid, cart, totalPrice, orderType, tableNumber);
        

        if (!cid || !cart || !totalPrice || !orderType ) {
            throw CustomError.createError({
                name: 'DataError',
                cause: '',
                message: `Error en los datos`,
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        //Obtiene carrito de la bd
        const existingCart = await cartsDAO.getCartById(cid)
        if (!existingCart) {
            throw CustomError.createError({
                name: 'CartError',
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

                if (product.quantity < existingProduct.quantity) {
                    // Validar stock para la cantidad adicional
                    const stockCheck = await productsDAO.findProductByIdd(product.pid);
                    const dif = existingProduct.quantity - product.quantity
                    const prodUpdate = await productsDAO.updateAddStockQuantity(stockCheck._id, dif);
                    if (!prodUpdate) {
                        throw CustomError.createError({
                            name: 'ProductError',
                            cause: '',
                            message: `Problema al actualizar catidad en producto`,
                            code: ErrorCodes.NOT_FOUND
                        })
                    }
                    continue;
                }

                const calQuantity = existingCart.products.find((prod) => {
                    if (prod.pid._id.toString() === product.pid) {

                        const quant = product.quantity - prod.quantity
                    }
                });

                const additionalQuantity = product.quantity - existingProduct.quantity;

                // Validar stock para la cantidad adicional
                const stockCheck = await productsDAO.findProductByIdd(product.pid);

                if (stockCheck.stock < additionalQuantity) {
                    throw CustomError.createError({
                        name: 'Cartupdate error',
                        cause: '',
                        message: `No hay suficiente stock para ${stockCheck.nombre}.`,
                        code: ErrorCodes.OUT_OF_STOCK
                    });
                }

                // Actualizar cantidad y reducir el stock
                const newStock = stockCheck.stock - additionalQuantity;

                const prodUpdate = await productsDAO.updateStock(stockCheck._id, newStock);
                if (!prodUpdate) {
                    throw CustomError.createError({
                        name: 'Cart',
                        cause: '',
                        message: `Problema al actualizar catidad en producto`,
                        code: ErrorCodes.NOT_FOUND
                    })
                }
            } else {
                // Si no coincide en propiedades, agregar como nuevo producto
                const stockCheck = await productsDAO.findProductById(product.pid);
                if (stockCheck.stock < product.quantity) {
                    throw CustomError.createError({
                        name: 'Cart update error',
                        cause: '',
                        message: `No hay suficiente stock para ${stockCheck.nombre}.`,
                        code: ErrorCodes.OUT_OF_STOCK
                    });
                }

                // Añadir al carrito y deducir stock
                const prodUpdate = await productsDAO.updateStockQuantity(stockCheck._id, product.quantity);
                if (!prodUpdate) {
                    throw CustomError.createError({
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


        const updateCart = await cartsDAO.UpdateCartById(cid, cart, totalPrice, orderType, tableNumber)
        if (!updateCart) {
            throw CustomError.createError({
                name: 'CartError',
                cause: '',
                message: `Problema al actualizar carrito`,
                code: ErrorCodes.NOT_FOUND
            })
        }

        return updateCart

    }

    async empyCart(cid) {
        if (!cid) {
            throw CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'The cart is not found to empty',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const cartFind = await this.getCartById(cid)



        if (cartFind.products.length === 0 && cartFind.status === 'empty')
            throw CustomError.createError({
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

        if (!cid || !pid || !quantity)
            throw CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verifique datos a mandar',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        //verifica que el producto y el carrito existan
        const carFind = await cartsDAO.getCartByIdStatusCreated(cid);
        
        if (!carFind)
            throw CustomError.createError({
                name: 'CartFindError',
                cause: '',
                message: 'Problemas al seleccionar carrito',
                code: ErrorCodes.NOT_FOUND
            })

        const productFind = await productsDAO.findProductById(pid);

        if (!productFind)
            throw CustomError.createError({
                name: 'ProductFindError',
                cause: '',
                message: 'Producto no encontrado',
                code: ErrorCodes.NOT_FOUND
            })
        

        // // Buscar si el producto ya está en el carrito
        const existingProduct = carFind.products.find(p => p.pid.equals(pid));
        if (existingProduct) {
            const cartUpd = cartsDAO.addCountToProductCart(cid, pid, quantity)
            if (!cartUpd)
                throw CustomError.createError({
                    name: 'CartUpdateQuantityError',
                    cause: '',
                    message: 'Error al actualizar catidad',
                    code: ErrorCodes.NOT_FOUND
                })
            return cartUpd
        } else {
            const cartUpd = cartsDAO.createProducInCart(cid, pid, quantity)
            if (!cartUpd)
                throw CustomError.createError({
                    name: 'ProductInCartError',
                    cause: '',
                    message: 'Error al crear el producto al carrito',
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
            throw CustomError.createError({
                name: 'Cart data error',
                cause: '',
                message: 'Verifique datos a mandar',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const carFind = await this.getCartById(cid);


        const productFind = await productsDAO.findProductById(pid);

        if (!carFind || !productFind)
            throw CustomError.createError({
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
            throw CustomError.createError({
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

        if (!cid || !uid)
            return CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verifique datos a mandar',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })

        const cart = await cartsDAO.verifyCartOfUser(cid, uid)
        if (!cart)
            return CustomError.createError({
                name: 'CartUserError',
                cause: '',
                message: 'Carrito no encontrado o el usuario no tiene permisos',
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
        const ticket = cartsDAO.saveTicket(cart.user._id, customer, cid, cart.products, cart.totalPrice, cart.branch._id)
        // uid, customer, cid, productsSell, cantidadTotal
        if (!ticket)
            return CustomError.createError({
                name: 'TicketError',
                cause: '',
                message: 'Error al crear el ticket',
                code: ErrorCodes.NOT_FOUND
            })

        //Actualiza el estado a Finalizado
        const updatedCart = cartsDAO.UpdCartToFinalized(cid)
        if (!updatedCart)
            return CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'Error al actualizar carrito a status: finalized ',
                code: ErrorCodes.NOT_FOUND
            })

        await cartsDAO.cartSave(cart) //Guarda en BD

        if (cart.customer || cart.customer.email !== null) {
            try {

                await transport.sendMail({
                    from: 'BurguerLocas',
                    to: cart.customer.email,
                    // to: cart.customer.email,
                    subject: "Ticket de compra",
                    html: templateHtmlCarrito(cart),
                    attachments: [
                        {
                            filename: 'meme.jpg',
                            path: `public/img/logoSl.png`,
                            // path: `${__dirname}/img/logoSl.png`,
                            cid: 'logoP'
                        }
                    ]
                })

            } catch (error) {
                console.error('Error al enviar comprobante por correo', error);
            }


        }


        return ticket
        // }

        // } catch (error) {
        //     console.error(error);
        //     // throw error;
        // }
    }

    async getCustomerCarts(cid) {

        if (!cid) {
            return CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verificar cliente',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const carts = await cartsDAO.getCustomerCarts(cid)
        if (!carts) {
            return CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'No hay carritos disponibles',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return carts

    }


    async UpdCartToCanceled(cid) {

        if (!cid) {
            return CustomError.createError({
                name: 'DataError',
                cause: '',
                message: 'Verificar carrito',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const existingCart = await cartsDAO.getCartById(cid)
        if (!existingCart) {
            return CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'El carrito no existe',
                code: ErrorCodes.NOT_FOUND
            })
        }
        for (const prod of existingCart.products) {
            const prodQauantityUpdate = await productsDAO.updateAddStockQuantity(prod.pid, prod.quantity);
            if (!prodQauantityUpdate) {
                return CustomError.createError({
                    name: 'ProductUpdateError',
                    cause: '',
                    message: 'Problemas al actualizar catidad del producto',
                    code: ErrorCodes.NOT_FOUND
                })
            }
        }
        // existingCart.products.map((prod) => {
        //     const prodUpdate = await productsDAO.updateAddStockQuantity(stockCheck._id, dif);
        // })
        const cart = await cartsDAO.UpdCartToCanceled(cid)
        if (!cart) {
            return CustomError.createError({
                name: 'CartError',
                cause: '',
                message: 'Problemas al cancelar el carrito',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return cart

    }

    async getTablesOccupied(userId) {

        if (!userId) {
            throw CustomError.createError({
                name: 'UserDataError',
                cause: '',
                message: 'Verificar usuario',
                code: ErrorCodes.MISSING_REQUIRED_FIELDS
            })
        }

        const user = await usersDAO.findUserById(userId)
        if (!user) {
            throw CustomError.createError({
                name: 'UserFindError',
                cause: '',
                message: 'Usuario no encontrado',
                code: ErrorCodes.NOT_FOUND
            })
        }
        // console.log(user.branch._id);

        const tablesOccupied = await cartsDAO.getTablesOccupied(user.branch._id)
        if (!tablesOccupied) {
            throw CustomError.createError({
                name: 'TablesError',
                cause: '',
                message: 'No hay mesas ocupadas',
                code: ErrorCodes.NOT_FOUND
            })
        }
        return tablesOccupied

    }
}