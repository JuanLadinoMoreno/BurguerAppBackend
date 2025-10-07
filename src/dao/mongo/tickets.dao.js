import ticketModel from "./models/ticket.model.js";



export default class TicketsDAO {

    async getTickets(code, user, customer, branch, start, end) {
        try {
          const query = {};
          
          if (start && end) {
            query.purchase_datetime = {
              $gte: new Date(start),
              $lte: new Date(end)
            };
          }

          if (code) {
            query.code = code
          }
          
          if (user) {
            query.user = user
          }

          if (customer) {
            query.customer = customer
          }

          if (branch) {
            query.branch = branch;
          }
            return await ticketModel.find(query)
                                    .populate('user')
                                    .populate('customer')
                                    .populate('branch')
                                    .populate({
                                      path: 'cart',
                                    })
                                    .populate({
                                        path: 'productsSell.pid',
                                        model: 'Product' 
                                      })
                                    .sort( { "purchase_datetime": -1 } )
                                    ;
        } catch (error) {
            console.log('Error on login', error);
            return null
        }
    }

    async getSalesFromMonthYear() {
        // Si no se envían mes y año, tomar el mes y año actuales
        const fechaActual = new Date();

        // const anioActual = anio || fechaActual.getFullYear();
        // const mesActual = mes !== undefined ? mes : fechaActual.getMonth(); // Mes de 0 a 11

        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth();

        const inicioMes = new Date(anioActual, mesActual, 1);
        const finMes = new Date(anioActual, mesActual + 1, 1);

        try {

            const sales = await ticketModel.aggregate([
                {
                    $match: {
                        "purchase_datetime": {
                            $gte: inicioMes,
                            $lte: finMes
                        }
                    }
                },

                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            return sales

        } catch (error) {
            console.log('Error on login', error);
            return null
        }
    }

    async getSalesFromYear() {
      
        try {

            const sales = await ticketModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            return sales

        } catch (error) {
            console.log('Error on login', error);
            return null
        }
    }

    async getSalesForMonth( inicio, fin, branch){
        try {
            const sales = await ticketModel.aggregate([
              {
                $match: {
                  purchase_datetime: {
                    $gte: new Date(inicio),
                    $lt: new Date(fin)
                  }
                }
              },
              {
                $lookup: {
                  from: "carts",
                  // Nombre de la colección de carts
                  localField: "cart",
                  // Campo en la colección actual que referencia a carts
                  foreignField: "_id",
                  // Campo en carts que corresponde al ID
                  as: "cartDetails" // Nombre del nuevo campo con los datos del join
                }
              },
              // Desempaqueta el array de cartDetails para acceder a sus propiedades
              {
                $unwind: "$cartDetails"
              },
              // Filtra los resultados por el ID de la branch en cartDetails
              {
                $match: {
                  "cartDetails.branch": branch // Reemplaza con el ID real de la branch
                }
              },
                {
                  $group: {
                    _id: { $month: "$purchase_datetime" }, // Agrupar por mes
                    totalSales: { $sum: "$amount" } // Sumar el monto total de ventas
                  }
                },
                {
                  $sort: { _id: 1 } // Ordenar por mes
                },
                {
                  $project: {
                    month: {
                      $let: {
                        vars: {
                          monthsInYear: [
                            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
                          ]
                        },
                        in: { $arrayElemAt: ["$$monthsInYear", { $subtract: ["$_id", 1] }] }
                      }
                    },
                    sales: "$totalSales",
                    _id: 0 // Eliminar `_id` del resultado final
                  }
                }
              ]);

              return sales;

        } catch (error) {
            console.log('Error on get sales fom month', error);
            return null
        }
    }

    async getSalesForCategoryMonth( inicio, fin, branch, tipo ){
        try {
            const sales = await ticketModel.aggregate([

                [
                  {
                    $match: {
                      purchase_datetime: {
                        $gte: inicio,
                        $lt: fin
                      }
                    }
                  },
                  {
                    $lookup: {
                      from: "carts",
                      // Nombre de la colección de carts
                      localField: "cart",
                      // Campo en la colección actual que referencia a carts
                      foreignField: "_id",
                      // Campo en carts que corresponde al ID
                      as: "cartDetails" // Nombre del nuevo campo con los datos del join
                    }
                  },
                  // Desempaqueta el array de cartDetails para acceder a sus propiedades
                  {
                    $unwind: "$cartDetails"
                  },
                  // Filtra los resultados por el ID de la branch en cartDetails
                  {
                    $match: {
                      "cartDetails.branch": branch // Reemplaza con el ID real de la branch
                    }
                  },
                    {
                      $unwind: "$productsSell"
                    },
                    {
                      $lookup: {
                        from: "products",
                        // Nombre de la colección de productos
                        localField: "productsSell.pid",
                        // Campo de referencia en tickets
                        foreignField: "_id",
                        // Campo de referencia en productos
                        as: "productDetails" // Nombre del array con los datos del producto
                      }
                    },
                    {
                      $unwind: "$productDetails"
                    },
                    {
                      $match: {
                        "productDetails.tipo": tipo
                      }
                    },
                    {
                      $addFields:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                          "productsSell.totalPrice": {
                            $multiply: [
                              {
                                $sum: [
                                  "$productDetails.precio",
                                  // Precio base del producto
                                  {
                                    $sum: "$productsSell.ingredientesExtra.precio"
                                  },
                                  // Suma de ingredientes extras
                                  "$productsSell.size.precio",
                                  // Precio del tamaño
                                  "$productsSell.selectedRevolcado.precio" // Precio del revolcado seleccionado
                                ]
                              },
                              "$productsSell.quantity" // Multiplicar por la cantidad
                            ]
                          }
                        }
                    },
                    {
                      $group:
                        /**
                         * _id: The id of the group.
                         * fieldN: The first field name.
                         */
                        {
                          _id: {
                            month: {
                              $month: "$purchase_datetime"
                            } // Agrupar por mes
                          },
                          totalSales: {
                            $sum: "$productsSell.totalPrice"
                          } // Sumar las ventas
                          // totalSales: { $sum: "$amount" } // Sumar el monto total de ventas por mes
                        }
                    },
                    {
                      $sort: {
                        _id: 1
                      }
                    },
                    // {
                    //   $match: {
                    //     "_id.month": 10
                    //   }
                    // }
                    {
                      $project: {
                        month: {
                          $let: {
                            vars: {
                                monthsInYear: [
                                    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                                    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
                                  ]
                            },
                            in: {
                              $arrayElemAt: [
                                "$$monthsInYear",
                                {
                                  $subtract: ["$_id.month", 1]
                                }
                              ]
                            }
                          }
                        },
                        sales: "$totalSales",
                        _id: 0 // Excluir `_id` del resultado final
                      }
                    }
                  ]
 
                
              ]);

              return sales;

        } catch (error) {
            console.log('Error on get sales fom month', error);
            return null
        }
    }
    
  async getTopSellerProduct(start, end, branch, limit) {
    try {
      const lim = !limit ? 10 : limit 
      const filters = {};
      if (branch) {
        filters.branch = branch;
      }

      if (start && end) {
        filters.purchase_datetime = {
          $gte: new Date(start),
          $lt: new Date(end),
        };
      }

      const sales = await ticketModel.aggregate([

        [
          { $match: filters },
          { $unwind: "$productsSell" },
          {
            $group: {
              _id: "$productsSell.pid",
              totalQuantity: { $sum: "$productsSell.quantity" },
              totalSales: { $sum: "$amount" },
            },
          },
          { $sort: { totalQuantity: -1 } },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: 1,
              totalQuantity: 1,
              name: { $arrayElemAt: ["$productDetails.nombre", 0] },
            },
          },
          { $limit:  parseInt(lim)},
        ]


      ]);

      return sales;

    } catch (error) {
      console.log('Error on get sales fom month', error);
      return null
    }
  }

}