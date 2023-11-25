import { Router } from 'express'
import { regisCustomer } from '../controllers/CustomerController'
import authenticateUser from '../middlewares/authenticateUser'

const customerRoutes = (Route: Router) => {
    Route.post('/customer/register', regisCustomer)

    Route.use('/customer', authenticateUser)
    Route.get('/customer/cart', (_, res) => res.json({ message: 'cart' }))
}

export default customerRoutes
