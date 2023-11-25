import { Request, Response, NextFunction } from 'express'
import { validateToken } from '../helpers/jwt'
import User from '../models/User'

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies['authorization']) return res.status(401).json({ message: 'Unauthenticated' })
    const token = validateToken(req.cookies['authorization'])

    if (!token) return res.status(401).json({ message: 'Unauthenticated' })

    const user = await User.findOne({ _id: token._id })
    if (!user) return res.status(401).json({ message: 'Unauthenticated' })

    res.locals.user = user
    return next()
}

export default authenticateUser
