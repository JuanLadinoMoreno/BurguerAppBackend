import branchModel from "./models/branch.model.js";
import userModel from "./models/user.model.js";

export default class BranchDAO{

    async getBranch() {
        try {
            const productos = await branchModel.find().sort({"createdAt": -1});
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

    async getBranchAvailable() {
        try {
            const productos = await branchModel.find({status: true});
            return productos.map(p => p.toObject({ virtuals: true }))

        } catch (error) {
            console.log(error);
            return null
        }
    }

    async getBranchById(id){
        try {
            const branchFound = await branchModel.findById(id);

            if(!branchFound) return null

            return branchFound;            
        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async updateBranchById(cid, branch){
        try {

            if (!cid || !branch)  return null

            return branchModel.findByIdAndUpdate(cid, { $set: branch }, { returnDocument: 'after' })
        } catch (error) {
            console.log(error);
            return null
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