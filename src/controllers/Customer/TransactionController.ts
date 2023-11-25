import { Request, Response } from 'express'
import { TUser } from '../../models/User'
import Transaction, { TTransactionProduct } from '../../models/Transaction'
import { validateBody } from '../../helpers/validateBody'
import Joi from 'joi'
import { createInvoiceNumber, createSummarize } from '../../helpers/transaction'
import Product from '../../models/Product'
import Cart from '../../models/Cart'

export const transactionList = async (req: Request, res: Response) => {
    const { _id: user_id } = res.locals.user as TUser

    const transactions = await Transaction.find({ user: user_id }).sort({ createdAt: -1 })
    return res.json(transactions)
}

type TSummarizeTransactionBody = {
    cart_ids: string[]
}

export const summarizeTransaction = async (req: Request, res: Response) => {
    const { _id: user_id } = res.locals.user as TUser

    try {
        validateBody<TSummarizeTransactionBody>(
            {
                cart_ids: Joi.array().min(1).required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const { cart_ids } = req.body as TSummarizeTransactionBody

    try {
        const { carts, total, fees, grand_total, checkout_availability } = await createSummarize(cart_ids, user_id)
        return res.json({ carts, total, fees, grand_total, checkout_availability })
    } catch (err) {
        return res.status(400).json(err)
    }
}

type TCheckoutTransactionBody = {
    cart_ids: string[]
}

export const checkoutTransaction = async (req: Request, res: Response) => {
    const { _id: user_id } = res.locals.user as TUser

    try {
        validateBody<TCheckoutTransactionBody>(
            {
                cart_ids: Joi.array().min(1).required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const { cart_ids } = req.body as TCheckoutTransactionBody

    try {
        const { carts, total, fees, grand_total, checkout_availability } = await createSummarize(cart_ids, user_id)
        if (!checkout_availability.is_available) return res.status(400).json({ message: 'Unable to checkout', errors: checkout_availability.notes })

        const transactionProducts: TTransactionProduct[] = await Promise.all(
            carts.map(async c => {
                const product = await Product.findById(c.product._id)
                if (product) {
                    product.stock -= c.quantity
                    await product.save()
                    await Cart.findOneAndDelete({ _id: c._id, user: user_id })
                }

                return {
                    _id: c.product._id,
                    name: c.product.name,
                    price: c.product.price,
                    quantity: c.quantity,
                    total: c.total,
                }
            }),
        )

        const transaction = await Transaction.create({
            invoice: createInvoiceNumber(),
            user: user_id,
            products: transactionProducts,
            total,
            fees,
            grand_total,
        })

        const createdTransaction = await Transaction.findById(transaction.id)

        return res.json({ message: 'Transaction successfull', data: createdTransaction })
    } catch (err) {
        return res.status(400).json(err)
    }
}
