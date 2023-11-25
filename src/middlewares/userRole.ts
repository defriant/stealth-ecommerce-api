import { NextFunction, Request, Response } from 'express'
import { TUser } from '../models/User'

type TUserRole = {
    customer: (req: Request, res: Response, next: NextFunction) => void | Response
    admin: (req: Request, res: Response, next: NextFunction) => void | Response
}

const userRole: TUserRole = {
    customer: (req, res, next) => {
        const { role } = res.locals.user as TUser
        if (role === 'customer') return next()
        return res.status(403).json({
            message: 'Access denied',
            errors: { role, expected_role: 'customer' },
        })
    },
    admin: (req, res, next) => {
        const { role } = res.locals.user as TUser
        if (role === 'admin') return next()
        return res.status(403).json({
            message: 'Access denied',
            errors: { role, expected_role: 'admin' },
        })
    },
}

export default userRole
