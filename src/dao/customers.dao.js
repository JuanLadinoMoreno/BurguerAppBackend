import customerModel from "./mongo/models/customers.model.js";



export default class CustomersDAO{

    async createCustomer(firstName, lastName, phone, email) {
        try {

            const usr = await customerModel.create({
                firstName,
                lastName,
                phone,
                email,
            })

            return usr

        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getCustomerByEmail(email){
        try {
            const userFound = await customerModel.findOne({ email });

            if(!userFound) return null

            return userFound;            
        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getCustomerByName(fisrtsName, lastName){
        try {
            const userFound = await customerModel.findOne({ fisrtsName, lastName });

            if(!userFound) return null

            return userFound;            
        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getCustomerById(id){
        try {
            if(!id) return null
            const userFound = await customerModel.findById(id);
            return userFound;            
        } catch (error) {
            console.log('Error ', error);
            return null
        }
    }

    async getCustomers(firstName, lastName, email) {
        try {
            const query = {};
            
            if (firstName) {
                query.firstName = { $regex: new RegExp(`^${firstName}$`, "i") };;
            }

            if (lastName) {
                query.lastName = { $regex: new RegExp(`^${lastName}$`, "i") };
            }

            if (email) {
                query.email = email
            }
            const customers = await customerModel.find(query);
            return customers.map(p => p.toObject({ virtuals: true }))
             
        } catch (error) {
            console.log('Error on login', e);
            return null
        }
    }

    async updateCustomerById(id, customer){
        try {

            if (!id || !customer)  return null

            return customerModel.findByIdAndUpdate(id, { $set: customer }, { returnDocument: 'after' })
        } catch (error) {
            console.log(error);
            return null
        }
    }
    
    async deleteCustomerById(id) {
        try {
            return await customerModel.findByIdAndDelete(id)
        } catch (error) {
            console.log('Error on login', e);
            return null
        }
    }

}