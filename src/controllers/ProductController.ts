import { Request, Response } from 'express'
import Product from '../models/Product'

export const productList = async (req: Request, res: Response) => {
    const products = await Product.find({}).select(['-description', '-createdAt', '-updatedAt']).exec()
    return res.json(products)
}

export const productDetail = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const product = await Product.findOne({ _id: id }).exec()
        if (!product) return res.status(404).json({ message: 'Product not found' })
        return res.json(product)
    } catch (err) {
        return res.status(404).json({ message: 'Product not found' })
    }
}
