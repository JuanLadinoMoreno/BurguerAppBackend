import mongoose, { Schema, model } from 'mongoose';

const usrSchema = new Schema(
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
        age: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        lastConnection: { 
            type: Date,
             default: null 
        }
        // user: {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'User'
        // }
    },
    {
        timestamps: true,
    }

)


const userModel = model('User', usrSchema, 'users')
export default userModel