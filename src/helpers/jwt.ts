import { JwtPayload, sign, verify } from 'jsonwebtoken'

const JWTSecret = 'qweasdzxc'

export const createUserToken = (data: { id: string; name: string; email: string }) => {
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
