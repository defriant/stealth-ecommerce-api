import { Request, Response } from 'express'
import Joi from 'joi'
import { validateBody } from '../helpers/validateBody'

type TLoginBody = {
    email: string
    password: string
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as TLoginBody

    try {
        validateBody<TLoginBody>(
            {
                email: Joi.string().required(),
                password: Joi.string().required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }
}
