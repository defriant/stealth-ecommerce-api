import { Request, Response } from 'express'
import { validateBody } from '../helpers/validateBody'
import Joi from 'joi'
import Product from '../models/Product'
import mongoose from 'mongoose'

type TProductBody = {
    name: string
    price: number
    description: string
    stock: number
}

export const addProduct = async (req: Request, res: Response) => {
    try {
        validateBody<TProductBody>(
            {
                name: Joi.string().min(3).required(),
                price: Joi.number().min(0).required(),
                description: Joi.string().min(0),
                stock: Joi.number().min(0).required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const { name, price, description, stock } = req.body as TProductBody

    const isProductNameExist = await Product.findOne({ name })
    if (isProductNameExist) return res.status(400).json({ message: `Product ${name} already listed` })

    const product = await Product.create({ name, price, description, stock })
    return res.json({
        message: `${product.name} has been added`,
        data: product,
    })
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        validateBody<TProductBody>(
            {
                name: Joi.string().min(3),
                price: Joi.number().min(0),
                description: Joi.string().min(0),
                stock: Joi.number().min(0),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) return res.status(404).json({ message: 'Product not found' })

    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const { name, price, description, stock } = req.body as TProductBody

    const isProductNameExist = await Product.findOne({ _id: { $ne: id }, name })
    if (isProductNameExist) return res.status(400).json({ message: `Product name ${name} already listed` })

    if (name) product.name = name
    if (typeof price !== 'undefined') product.price = price
    if (description) product.description = description
    if (typeof stock !== 'undefined') product.stock = stock

    await product.save()

    return res.json({ message: `${product.name} has been updated`, data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) return res.status(404).json({ message: 'Product not found' })

    const product = await Product.findByIdAndDelete(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    return res.json({ message: `${product.name} has been deleted` })
}
