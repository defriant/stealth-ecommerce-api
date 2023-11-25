import { Router } from 'express'
import { login, registration } from '../controllers/AuthController'

const authRoute = Router({ mergeParams: true })

authRoute.post('/login', login)
authRoute.post('/registration', registration)

export default authRoute
