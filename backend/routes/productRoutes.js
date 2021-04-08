import express from 'express'
const router = express.Router()
import { getProductById, getProducts, createProductReview, getTopProducts } from '../controllers/productControllers.js'
import { protect } from '../middleware/authMiddleware.js'



router.route('/:id/reviews').post(protect, createProductReview)
router.route('/').get(getProducts)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductById)


export default router