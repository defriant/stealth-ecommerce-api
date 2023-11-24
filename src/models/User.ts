import mongoose from 'mongoose'
import { schemaOptions } from '../config/db'

export type TUser = {
    name: string
    email: string
    phone: string
    address: string
    password: string
    role: string
}

const UserSchema = new mongoose.Schema<TUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    schemaOptions,
)

export default mongoose.model('User', UserSchema)
