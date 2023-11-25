import { Request, Response } from 'express'
import { TUser } from '../models/User'

export const profile = async (req: Request, res: Response) => {
    const { _id, name, email, address, phone, role } = res.locals.user as { _id: string } & TUser
    return res.json({ _id, name, email, address, phone, role })
}
