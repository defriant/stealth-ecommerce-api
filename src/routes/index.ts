import { Response, Router } from 'express'
import productsRoute from './product'
import authRoute from './auth'
import profileRoute from './profile'
import customerRoute from './customer'
import authenticateUser from '../middlewares/authenticateUser'
import userRole from '../middlewares/userRole'
import adminRoute from './admin'

const Route = Router()

Route.use('/products', productsRoute)
Route.use('/auth', authRoute)
Route.use('/profile', authenticateUser, profileRoute)
Route.use('/customer', authenticateUser, userRole.customer, customerRoute)
Route.use('/admin', adminRoute)

Route.all('/*', (_, res: Response) => res.status(404).json({ message: 'Resource not found' }))

export default Route
