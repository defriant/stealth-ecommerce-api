import mongoose from 'mongoose'
import { TProduct } from './Product'
import { TUser } from './User'
import { schemaOptions } from '../config/db'

export type TCart = {
    _id: string
    product: TProduct
    user: TUser
    quantity: number
}

const CartSchema = new mongoose.Schema<TCart>(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            select: false,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    schemaOptions,
)

const Cart = mongoose.model('Cart', CartSchema)

export default Cart
