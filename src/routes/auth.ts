import { Router } from 'express'
import { login, profile } from '../controllers/AuthController'
import authenticateUser from '../middlewares/authenticateUser'

const authRoutes = (Route: Router) => {
    Route.post('/auth/login', login)
    Route.get('/auth/profile', authenticateUser, profile)
}

export default authRoutes
