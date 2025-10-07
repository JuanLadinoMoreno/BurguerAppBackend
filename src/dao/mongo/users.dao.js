import moment from "moment";
import userModel from "../mongo/models/user.model.js";
import bcryptjs from "bcryptjs";


export default class usersDAO{

    async createUser(firstName, lastName, age, email, pswHash, tipo, branch) {
        try {

            const usr = await userModel.create({
                firstName,
                lastName,
                age: +age,
                email,
                password: pswHash,
                role: tipo,
                branch
            })

            return usr

        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getUserByEmail(email){
        try {
            const userFound = await userModel.findOne({ email }).populate('branch');

            if(!userFound) return null

            return userFound;            
        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async createUserss(firstName, lastName, age, email, password) {
        try {

            const userFound = await userModel.findOne({ email });
            if (userFound)
                return null;
            
            const pswHash = await bcryptjs.hash(password, 11)
            const now = moment()

            const usr = await userModel.create({
                firstName,
                lastName,
                age: +age,
                email,
                password: pswHash,
            })

            return usr
            
        } catch (e) {
            console.log('Error al crear usuario', e);
            return null
        }
    }

    async Onlogin (email) {
        try {    
            const userFound = await userModel.findOne({ email });
            return userFound;    
            
        } catch (error) {
            console.log('Error on login', e);
            return null
        }
    }

    async findUserById (id) {
        try {   
            const userFound = await userModel.findById(id).populate('branch')
            
            if (!userFound)  return null
            
            return userFound;    
            
        } catch (error) {
            console.log('Error on login', error);
            return null
        }
    }

    async updateUserById(id, user){
        try {

            if (!id || !user)  return null

            return userModel.findByIdAndUpdate(id, { $set: user }, { returnDocument: 'after' })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async getUsers(firstName, lastName, email) {
        try {
            const query = {}
            
            if (firstName) {
                query.firstName = { $regex: new RegExp(`^${firstName}$`, "i") }
            }

            if (lastName) {
                query.lastName = { $regex: new RegExp(`^${lastName}$`, "i") }
            }

            if (email) {
                query.email =  email 
            }
            const users = await userModel.find(query).populate('branch')
            return users
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async deleteUserById(uid) {
        try {
            return await userModel.findByIdAndDelete(uid)
        } catch (error) {
            console.log('Error on login', e);
            return null
        }
    }

    async resetPassword(uid, password) {
        try {
            if (!uid || !password)  return null
            
            const hashedPassword = await bcryptjs.hash(password, 11);

            return userModel.findByIdAndUpdate(uid, { password: hashedPassword }, { returnDocument: 'after' })

        } catch (error) {
            console.log(error);
            return null
            
        }
    }


}