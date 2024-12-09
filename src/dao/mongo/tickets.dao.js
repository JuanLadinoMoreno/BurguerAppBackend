import ticketModel from "./models/ticket.model.js";



export default class TicketsDAO {

    async getTickets() {
        try {
            return await ticketModel.find()
                                    .populate('user')
                                    .populate('customer')
                                    .populate('cart')
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

    async getSalesForMonth(){
        try {
            const sales = await ticketModel.aggregate([
 
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

}