import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { validateBody } from '../helpers/validateBody'

type TAddCart = {
    product_id: string
}

export const addCart = async (req: Request, res: Response) => {
    const { product_id } = req.body as TAddCart

    try {
        validateBody<TAddCart>(
            {
                product_id: Joi.string().required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    return res.json(product_id)
}
