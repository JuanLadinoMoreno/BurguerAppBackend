import moment from "moment";
import userModel from "../mongo/models/user.model.js";
import bcryptjs from "bcryptjs";


export default class usersDAO{

    async createUser(firstName, lastName, age, email, pswHash) {
        try {

            const usr = await userModel.create({
                firstName,
                lastName,
                age: +age,
                email,
                password: pswHash,
                role: 'user'
            })

            return usr

        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getUserByEmail(email){
        try {
            const userFound = await userModel.findOne({ email });

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
            const userFound = await userModel.findById(id) 
            
            if (!userFound)  return null
            
            return userFound;    
            
        } catch (error) {
            console.log('Error on login', e);
            return null
        }
    }

    async getUsers() {
        try {
            const users = await userModel.find();
            return users
        } catch (error) {
            console.log('Error on login', e);
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


}