
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import { PORT } from './config/config.js';

import productsRouter from './routes/products.router.js'
import categoriesRouter from './routes/categories.router.js'
import cartsRouter from './routes/carts.router.js'
import sessionRouter from './routes/session.router.js'

import {errorHandler} from './middlewares/errors/index.js';

import { connectMDb } from '../src/config/database.js';


import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url';

// const PORT = process.env.PORT;

const app = express();

// Obtener el equivalente a __dirname en ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));


// app.use(cors({
//     // origin: 'http://127.0.0.1:5173',
//     origin: '*',
//     credentials: true
// }))

const allowedOrigins = [
    'http://127.0.0.1:5173',  // Local
    'http://localhost:5173',  // Local
    'http://127.0.0.1:8080',  // Local
    'http://localhost:8080',  // Local
    'https://burguerappbackend.up.railway.app/'  // Producción
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


app.use(cookieParser())

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', sessionRouter)

app.use('*', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.use(errorHandler)


const manin = async => {
    
    // se conecta a la bd de mongoose
    connectMDb()

    app.listen(PORT, () => {
        console.log('Servidor preparado!!');
    });

}

manin()








