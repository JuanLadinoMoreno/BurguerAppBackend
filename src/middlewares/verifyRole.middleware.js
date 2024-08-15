import mongoose from "mongoose";
import userModel from "../dao/mongo/models/user.model.js"


export const verifyAdminRoleMdw = async (req, res, next) => {
    try {
        
        if (!req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'User Problem auth!',
            });
        }
        const usrId = new mongoose.Types.ObjectId(req.user)

        const userfind = await userModel.findOne(
            { 
                _id: usrId,
                role: 'admin'
             }
        )
        if (!userfind) {
            return res.status(403).json({
                message: ["You do not have permissions!"],
            });
        }

        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error,
        });
    }


}

export const verifyAdminPremRoleMdw = async (req, res, next) => {
    try {
        
        if (!req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'User Problem auth!',
            });
        }
        const usrId = new mongoose.Types.ObjectId(req.user)
        

        const userfind = await userModel.findOne(
            { 
                _id: usrId,
                role: { $in: ['admin', 'premium'] }
             }
        )
        if (!userfind) {
            return res.status(403).json({
                message: ["You do not have permissions!"],
            });
        }

        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error,
        });
    }


}


export const verifyUserRoleMdw = async (req, res, next) => {
    try {

        if (!req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'User Problem auth!',
            });
        }
        const usrId = new mongoose.Types.ObjectId(req.user)
        // const usrId = req.user
        console.log('usrId', usrId);

        const userfind = await userModel.findOne(
            { 
                _id: usrId,
                role: 'user'
             }
        )
        // console.log('userfind', userfind);
        if (!userfind) {
            return res.status(403).json({
                message: ["You do not have permissions!"],
            });
        }

        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error,
        });
    }


}