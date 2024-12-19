import mongoose, { Schema, model, set } from "mongoose";

// Subesquema para tamaños
const sizesSchema = new Schema({
    id: { type: String, required: true },
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
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
});

const productCartSchema = new Schema({
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    ingredientesExtra: [IngredienteExtraSchema],

    selectedRevolcado: {
        type: IngredienteRevolcadoSchema,
        set: r => r === "" ? {} : r
    },

    size: {
        type: sizesSchema,
        set: s => s === "" ? {} : s
    }
})

const cartsSchema = new Schema({

    cid: {
        type: String,
        // required: true
    },
    products: {
        type: [productCartSchema],
        default: []
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        // enum: ['pending', 'completed', 'cancelled'],
        // default: 'pending',
        required: true
    },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: false,
        set: v => v === "" ? null : v
    },
    totalPrice: {
        type: Number,
        required: true
    },
    branch: {
        type: mongoose.Types.ObjectId,
        ref: 'Branch',
        required: true,
    }

},
    {
        timestamps: true,
        // timestamps: { createdAt: 'cart_datetime', updatedAt: false }
    }
)

// cartsSchema.virtual('id').get(function () {
//     return this._id.toString();
// })

const cartsModel = model('Carts', cartsSchema, 'carts')
export default cartsModel




// products: {
//     type: [
//         {
//             pid:{
//                 type: mongoose.Types.ObjectId,
//                 ref: 'Poduct'
//             }
//         }
//     ],
//     default: [productSchema],
// },