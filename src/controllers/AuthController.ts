import { Request, Response } from 'express'
import Joi from 'joi'
import { validateBody } from '../helpers/validateBody'
import bcrypt from 'bcrypt'
import User, { TUser } from '../models/User'
import { createUserToken } from '../helpers/jwt'

type TRegistrationBody = {
    name: string
    email: string
    phone: string
    address: string
    password: string
    confirm_password: string
}

export const registration = async (req: Request, res: Response) => {
    const { name, email, phone, address, password, confirm_password } = req.body as TRegistrationBody

    try {
        validateBody<TRegistrationBody>(
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

    const isExist = await User.findOne({ email })
    if (isExist) return res.status(400).json({ message: `User with email ${email} already exist` })

    if (password !== confirm_password) return res.status(400).json({ message: `Confirm password doesn't match` })

    const encryptPassword = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({
            name,
            email,
            phone,
            address,
            password: encryptPassword,
            role: 'customer',
        })

        const createdUser: TUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            role: user.role,
        }

        return res.json({
            message: 'Registration successfull',
            data: createdUser,
        })
    } catch (err: any) {
        return res.status(422).json({ message: err.message })
    }
}

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

    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(400).json({ message: 'Invalid credential' })

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return res.status(400).json({ message: 'Invalid credential' })

    const userData: TUser = {
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
