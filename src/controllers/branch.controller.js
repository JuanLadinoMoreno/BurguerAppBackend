import { BranchService } from "../services/branch.services.js";

const branchService = new BranchService()

export const getBranch = async (req, res) => {
    
    try {
        const products = await branchService.getBranch();
        if (!products) return res.json({ status: 'error', message: 'Products null' })

        res.status(200).json({ status: 'success', payload: products })
    } catch (error) {
        // return res.status(500).json({ status: error,  message: error.message });
        next(error)
    }
}

export const createBranch = async (req, res, next) => {

    try {

        const branch = req.body
        const branchCreated = await branchService.createBranch(branch);

        if (!branchCreated) {
            return res.status(500).json({ status: 'error', message: 'Error al crear sucursal' })
        }

        res.status(201).json({ status: 'success', payload: branchCreated })
    } catch (error) {
        next(error)
    }

}

export const getBranchAvailable = async (req, res) => {
    
    try {
        const branch = await branchService.getBranchAvailable();
        if (!branch) return res.json({ status: 'error', message: 'Branch null' })

        res.status(200).json({ status: 'success', payload: branch })
    } catch (error) {
        // return res.status(500).json({ status: error,  message: error.message });
        next(error)
    }
}

export const changeUserBranch = async (req, res, next) => {
    try {
        const uid = req.params.uid
        const { branchId } = req.body
        
        const branchCreated = await branchService.changeUserBranch(uid, branchId);

        if (!branchCreated) {
            return res.status(500).json({ status: 'error', message: 'Error al crear sucursal' })
        }

        res.status(201).json({ status: 'success', payload: branchCreated })
    } catch (error) {
        next(error)
    }

}