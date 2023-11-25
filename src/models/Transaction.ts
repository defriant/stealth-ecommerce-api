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
    user: TUser
    products: TTransactionProduct[]
    invoice: string
    total: number
    fees: TTransactionFees[]
    grand_total: number
}

const TransactionSchema = new mongoose.Schema<TTransaction>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
        invoice: { type: String, required: true },
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
