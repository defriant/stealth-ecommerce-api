import { Request, Response } from 'express'
import User, { TUser } from '../models/User'
import { validateBody } from '../helpers/validateBody'
import Joi from 'joi'

export const profileDetail = async (req: Request, res: Response) => {
    const user = res.locals.user as TUser
    return res.json(user)
}

type TUpdateProfile = {
    name: string
    phone: string
    address: string
}

export const updateProfile = async (req: Request, res: Response) => {
    const { _id } = res.locals.user as TUser
    const { name, phone, address } = req.body as TUpdateProfile

    try {
        validateBody<TUpdateProfile>(
            {
                name: Joi.string(),
                phone: Joi.string(),
                address: Joi.string(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const user = await User.findById(_id)
    if (user) {
        if (name) user.name = name
        if (phone) user.phone = phone
        if (address) user.address = address

        await user.save()

        const userData: TUser = {
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        }

        return res.json(userData)
    }

    return res.status(404).json({ message: 'User not found' })
}
