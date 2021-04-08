import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc        Fetch all pruducts
// @route       GET /api/products
// @access      Public

const getProducts = asyncHandler(async (req,res) => {
    // itmes per page
    const pageSize = 4
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({...keyword})

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page -1))

    res.json({ products, page, pages: Math.ceil( count / pageSize ) })
})

// @desc        Fetch all pruducts
// @route       GET /api/products
// @access      Public

const getProductById = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)

    if(product)  {
         res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not Found')
    } 
})

// @desc        Create new review
// @route       POST /api/products/:id/review
// @access      PRivate

const createProductReview = asyncHandler(async (req,res) => {
    const {
        rating,
        comment
    } = req.body
    
    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        
        if(alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length  
        
        await product.save()
        res.status(201).json({ message: 'Review added'})

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc        Create top rated products
// @route       GET /api/products/top
// @access      Public

const getTopProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
})

export {
    getProducts,
    getProductById,
    createProductReview,
    getTopProducts
}