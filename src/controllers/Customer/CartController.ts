import { Request, Response } from 'express'
import { TUser } from '../../models/User'
import Joi from 'joi'
import { validateBody } from '../../helpers/validateBody'
import Product from '../../models/Product'
import Cart from '../../models/Cart'
import mongoose from 'mongoose'

export const cartList = async (req: Request, res: Response) => {
    const { _id: user_id } = res.locals.user as TUser

    const carts = await Cart.find({ user: user_id }).populate('product')
    return res.json(carts)
}

type TAddCartBody = {
    product_id: string
}

export const addCart = async (req: Request, res: Response) => {
    const { product_id } = req.body as TAddCartBody
    const { _id: user_id } = res.locals.user as TUser

    try {
        validateBody<TAddCartBody>(
            {
                product_id: Joi.string().required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const isValidProductId = mongoose.Types.ObjectId.isValid(product_id)
    if (!isValidProductId) return res.status(404).json({ message: 'Product not found' })

    const product = await Product.findOne({ _id: product_id })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const inCart = await Cart.findOne({ product: product._id, user: user_id })

    if (inCart) {
        inCart.quantity += 1
        await inCart.save()
    } else {
        await Cart.create({
            product: product._id,
            user: user_id,
            quantity: 1,
        })
    }

    const carts = await Cart.find({ user: user_id }).populate('product')

    return res.json({ message: `${product.name} added to cart`, data: carts })
}

type TUpdateCartBody = {
    quantity: number
}

export const updateCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const { _id: user_id } = res.locals.user as TUser
    const { quantity } = req.body as TUpdateCartBody

    try {
        validateBody<TUpdateCartBody>(
            {
                quantity: Joi.number().min(0).required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) return res.status(404).json({ message: 'Cart not foundd' })

    if (quantity === 0) {
        const cart = await Cart.findOneAndDelete({ _id: id, user: user_id }).populate('product')
        if (!cart) if (!cart) return res.status(404).json({ message: 'Cart not found' })
        return res.json({ message: `${cart.product.name} has been removed from your cart` })
    }

    const cart = await Cart.findOne({ _id: id, user: user_id }).populate('product')
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.quantity = quantity
    await cart.save()

    return res.json(cart)
}

export const deleteCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const { _id: user_id } = res.locals.user as TUser

    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) return res.status(404).json({ message: 'Cart not foundd' })

    const cart = await Cart.findOneAndDelete({ _id: id, user: user_id }).populate('product')
    if (!cart) if (!cart) return res.status(404).json({ message: 'Cart not found' })
    return res.json({ message: `${cart.product.name} has been removed from your cart` })
}
