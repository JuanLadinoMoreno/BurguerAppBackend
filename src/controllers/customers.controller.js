import CustomersService from "../services/customers.services.js";


const customersService = new CustomersService()

export const register = async (req, res, next) => {
    try {        

        const { firstName, lastName, phone, email } = req.body
        

        const userFound = await customersService.createCustomer(firstName, lastName, phone, email)
        
        // const userFound = await userModel.findOne({ email });

        return res.status(200).json({
            status: 'success',
            payload: {
                id: userFound.id,
                fisrtsName: userFound.firstName,
                email: userFound.email,
            }
        });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

export const getCustomers = async (req, res, next) => {
    try {
        const customers = await customersService.getCustomers();
        res.status(200).json({ status: 'success', payload: customers })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const getCustomerById = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const customers = await customersService.getCustomerById(cid);
        res.status(200).json({ status: 'success', payload: customers })
    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const updateCustomerById = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const customer = req.body
        const customerUpd = await customersService.updateCustomerById(cid, customer);
        res.status(201).json({ status: 'success', payload: customerUpd })
    } catch (error) {
        
        next(error)
    }
}

export const deleteCustomerById = async (req, res, next) => {
    try {
        const id = req.params.cid
        const user = await customersService.deleteCustomerById(id);
        res.status(200).json({ status: 'success', payload: user })
    } catch (error) {
        console.log(error);

        next(error)
    }
}