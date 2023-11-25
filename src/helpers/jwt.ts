import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { TUser } from '../models/User'

const JWTSecret = 'qweasdzxc'

export const createUserToken = (data: TUser) => {
    const token = sign(data, JWTSecret, {
        expiresIn: '30d',
    })

    return token
}

export const validateToken = (token: string) => {
    try {
        const validate = verify(token, JWTSecret) as JwtPayload
        return validate
    } catch (err) {
        return null
    }
}
