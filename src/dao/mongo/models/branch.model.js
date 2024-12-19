import { model, Schema } from "mongoose";

const branchSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    }, {timestamps: true }
    
)

const branchModel = model('Branch', branchSchema, 'branch')
export default branchModel