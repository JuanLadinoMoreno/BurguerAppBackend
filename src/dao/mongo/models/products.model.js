// import { Mongoose } from "mongoose"
// const { default: mongoose } = require("mongoose")
import mongoose, { Schema, model } from 'mongoose';

// Subesquema para tamaños
const sizesSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
});

// Subesquema para ingredientes extra
const IngredienteExtraSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
});

// Subesquema para revolcado
const IngredienteRevolcadoSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
});



const prodSchema = new Schema({
    aderesos: {
        type: [String],
        required: true,
        // unique: true
    },

    nombre: {
        type: String,
        required: true,
        // unique: true
    },

    preparacion: {
        type: String,
        required: true,
        // unique: true
    },

    ingrePrep: {
        type: String,
        required: true,
        // unique: true
    },

    pan: {
        type: String,
        required: true,
        // unique: true
    },

    precio: {
        type: Number,
        required: true,
        // unique: true
    },

    categoria: {
        type: String,
        required: true,
        // unique: true
    },

    tipo: {
        type: String,
        required: true,
        // unique: true
    },

    vegetales: {
        type: [String],
        required: true,
    },

    status: {
        type: Boolean,
        required: true,
        // unique: true
    },

    stock: {
        type: Number,
        required: true,
        // unique: true
    },

    tipoRevolcado: {
        type: Boolean,
        default: false
    },

    ingredientesExtra: [IngredienteExtraSchema],

    ingredientesRevolcado: [IngredienteRevolcadoSchema],

    tamanos: [sizesSchema],

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }


},
    {
        timestamps: true,
    }
)

prodSchema.virtual('id').get(function () {
    return this._id.toString();
})


// export default  mongoose.model('Poduct', prodSchema, 'products')
const productModel = model('Product', prodSchema, 'products')
export default productModel
//  module.exports = model('Poduct', prodSchema, 'products')
// export default model('Poduct', prodSchema, 'products')