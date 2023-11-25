import mongoose from 'mongoose'
import { schemaOptions } from '../config/db'

export type TProduct = {
    _id: string
    name: string
    price: number
    description: string
    stock: number
}

const ProductSchema = new mongoose.Schema<TProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        stock: { type: Number, required: true },
    },
    schemaOptions,
)

const Product = mongoose.model('Product', ProductSchema)

export default Product
