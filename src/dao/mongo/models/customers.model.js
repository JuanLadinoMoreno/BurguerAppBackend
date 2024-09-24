import { Schema, model } from 'mongoose';

const customerSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },

    },
    {
        timestamps: true,
    }

)


const customerModel = model('Customer', customerSchema, 'customers')
export default customerModel