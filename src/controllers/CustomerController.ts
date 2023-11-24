import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { validateBody } from '../helpers/validateBody'

type TRegisCustomerBody = {
    name: string
    email: string
    phone: string
    address: string
    password: string
    confirm_password: string
}

export const regisCustomer = async (req: Request, res: Response) => {
    const { name, email, phone, address, password, confirm_password } = req.body as TRegisCustomerBody

    try {
        validateBody<TRegisCustomerBody>(
            {
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.string().required(),
                address: Joi.string().required(),
                password: Joi.string().required(),
                confirm_password: Joi.string().required(),
            },
            req.body,
        )
    } catch (err) {
        return res.status(422).json(err)
    }

    const isExist = await User.findOne({ email }).exec()
    if (isExist) return res.status(400).json({ message: `User with email ${email} already exist` })

    if (password !== confirm_password) return res.status(400).json({ message: `Confirm password doesn't match` })

    const encryptPassword = await bcrypt.hash(password, 10)

    try {
        const createUser = await User.create({
            name,
            email,
            phone,
            address,
            password: encryptPassword,
            role: 'customer',
        })

        const createdUser = await User.findOne({ _id: createUser.get('_id') })
            .select(['-_id', '-password', '-role'])
            .exec()

        return res.json({
            message: 'Registration successfull',
            data: createdUser,
        })
    } catch (err: any) {
        return res.status(422).json({ message: err.message })
    }
}
