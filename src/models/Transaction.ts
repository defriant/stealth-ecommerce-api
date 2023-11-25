import mongoose from 'mongoose'
import { TUser } from './User'
import { schemaOptions } from '../config/db'

export type TTransactionProduct = {
    _id: string
    name: string
    price: number
    quantity: number
    total: number
}

export type TTransactionFees = {
    name: string
    cost: number
}

export type TTransaction = {
    _id: string
    invoice: string
    user: TUser
    products: TTransactionProduct[]
    total: number
    fees: TTransactionFees[]
    grand_total: number
}

const TransactionSchema = new mongoose.Schema<TTransaction>(
    {
        invoice: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            select: false,
        },
        products: [
            {
                _id: String,
                name: String,
                price: Number,
                quantity: Number,
                total: Number,
            },
        ],
        total: { type: Number, required: true },
        fees: [
            {
                name: { type: String, required: true },
                cost: { type: Number, required: true },
            },
        ],
        grand_total: { type: Number, required: true },
    },
    schemaOptions,
)

export const TransactionFees: TTransactionFees[] = [
    {
        name: 'Admin fee',
        cost: 7500,
    },
]

const Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
