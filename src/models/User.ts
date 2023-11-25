import mongoose from 'mongoose'
import { schemaOptions } from '../config/db'

export type TUser = {
    _id: string
    name: string
    email: string
    phone: string
    address: string
    role: string
}

const UserSchema = new mongoose.Schema<TUser & { password: string }>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true, select: false },
        role: { type: String, required: true },
    },
    schemaOptions,
)

const User = mongoose.model('User', UserSchema)

export default User
