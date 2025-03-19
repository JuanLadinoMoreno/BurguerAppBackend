import { BranchService } from "../services/branch.services.js";

const branchService = new BranchService()

export const getBranch = async (req, res) => {
    
    try {
        const branch = await branchService.getBranch();
        if (!branch) return res.status(404).json({ status: 'error', message: 'Sucursales no encontradas' })

        res.status(200).json({ status: 'success', payload: branch })
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
        if (!branch) return res.status(404).json({ status: 'error', message: 'Sucuarsales no encontradas' })

        res.status(200).json({ status: 'success', payload: branch })
    } catch (error) {
        // return res.status(500).json({ status: error,  message: error.message });
        next(error)
    }
}

export const updateBranchById = async (req, res, next) => {
    try {        
        const bid = req.params.bid
        const branch = req.body
        const branchUpd = await branchService.updateBranchById(bid, branch)
        if(!branchUpd) return res.status(404).json({status: 'error', message: 'Sucursal no encontrada o no se pudo actualizar la sucursal'})
        res.status(200).json({status: 'success', payload: branchUpd})
    } catch (error) {
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