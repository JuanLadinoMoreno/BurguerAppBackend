import branchModel from "./models/branch.model.js";
import userModel from "./models/user.model.js";

export default class BranchDAO{

    async getBranch() {
        try {
            const productos = await branchModel.find();
            return productos.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log(error);
            return null
        }
    }

    async createBranch(branch){
        try {
            return await branchModel.create(branch)
        } catch (error) {
            console.log('Error al crear sucursal', e);
        }
    }

    async changeUserBranch(userId, branchId){
        try {
            return userModel.findByIdAndUpdate(userId, { $set: { branch: branchId } }, { returnDocument: 'after' }).populate('branch')
        } catch (error) {
            console.log(error);
            
        }
    }
}