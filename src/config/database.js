import mongoose from 'mongoose'
import { NOTES_APP_MONGODB_DATABASE, NOTES_APP_MONGODB_HOST, URL_MONGO_DBATLAS } from './config.js'


export const connectMDb = async () => {


    // const MONGODB_URI = `mongodb://localhost:27017/BurguerRobles`//local

    const MONGODB_URI = `mongodb+srv://${NOTES_APP_MONGODB_HOST}.8wuolks.mongodb.net/${NOTES_APP_MONGODB_DATABASE}` //atlas

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database is conected')
        
    } catch (err) {
        console.log(err)
    }
}

// Función para desconectar de la base de datos
export const disconnectMDb = () => {
    mongoose.disconnect()
    .then(() => console.log('Database is disconnected'))
    .catch((err) => console.error('Database disconnection error:', err));
};