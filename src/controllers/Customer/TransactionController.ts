import { Request, Response } from 'express'
import { TUser } from '../../models/User'
import Transaction from '../../models/Transaction'
import { validateBody } from '../../helpers/validateBody'
import Joi from 'joi'
import { createSummarize } from '../../helpers/transaction'

export const transactionList = async (req: Request, res: Response) => {
    const { _id: user_id } = res.locals.user as TUser

    const transactions = await Transaction.find({ user: user_id })
    // const number = rng(1000000000, 9999999999, 0)
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
