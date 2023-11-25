import { Request, Response } from 'express'
import Product from '../models/Product'
import mongoose from 'mongoose'

export const productList = async (req: Request, res: Response) => {
    const products = await Product.find({}).select(['-description', '-createdAt', '-updatedAt'])
    return res.json(products)
}

export const productDetail = async (req: Request, res: Response) => {
    const { id } = req.params

    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) return res.status(404).json({ message: 'Product not found' })

    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    return res.json(product)
}
