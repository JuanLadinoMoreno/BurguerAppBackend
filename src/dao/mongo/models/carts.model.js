import mongoose, { Schema, model } from "mongoose";

const productCartSchema = new Schema({
    pid: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    }
})

const cartsSchema = new Schema({

    cid: {
        type: String,
        // required: true
    },
    products:{
        type: [productCartSchema],
        default: []
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true
    }
    // products: [productSchema],

    
    
})

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