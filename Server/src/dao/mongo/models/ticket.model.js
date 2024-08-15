import mongoose, { Schema, model } from 'mongoose';

const ticketSchema = new Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true,
        },
        amount: {
            type: Number,
            required: true
        },
        purchaser: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cart: {
            type: mongoose.Types.ObjectId,
            ref: 'Carts',
            required: true
        },
        productsSell: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
        // purchase_datetime: {
        //     type: String,
        //     default: Date.now
        // },
    },
    {
        timestamps: { createdAt: 'purchase_datetime', updatedAt: false }
    }

)


const ticketModel = model('Ticket', ticketSchema, 'tickets')
export default ticketModel