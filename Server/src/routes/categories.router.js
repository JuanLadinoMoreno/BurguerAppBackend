import {Router} from 'express'
import { getCatProducts } from '../controllers/categories.controller.js';



const router = Router()


router.get('/', getCatProducts);

export default router