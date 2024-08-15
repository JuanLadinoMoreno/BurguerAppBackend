import {Schema, model} from 'mongoose';


const categoriesSchema = new Schema({
    ids: {
        type: String,
        required: true,
        unique: true
    },
    
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    
    url: {
        type: String,
        required: true,
        // unique: true
    },
    
})

// prodSchema.virtual('id').get(function () {
//     return this._id.toString();
// })


const categoriesModel =  model('Category', categoriesSchema, 'categories')
export default  categoriesModel
