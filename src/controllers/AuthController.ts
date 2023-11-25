import { Request, Response } from 'express'
import Joi from 'joi'
import { validateBody } from '../helpers/validateBody'
import bcrypt from 'bcrypt'
import User, { TUser } from '../models/User'
import { createUserToken } from '../helpers/jwt'

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

    const user = await User.findOne({ email }).exec()
    if (!user) return res.status(400).json({ message: 'Invalid credential' })

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return res.status(400).json({ message: 'Invalid credential' })

    const userData: { _id: string } & TUser = {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
    }
    const userToken = createUserToken(userData)

    res.cookie('authorization', userToken, {
        maxAge: 2592000000,
    })

    return res.json(userData)
}

export const profile = async (req: Request, res: Response) => {
    const { _id, name, email, address, phone, role } = res.locals.user as { _id: string } & TUser
    return res.json({ _id, name, email, address, phone, role })
}
