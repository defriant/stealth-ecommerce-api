import { Router } from 'express'
import { regisCustomer } from '../controllers/CustomerController'

const customerRoutes = (Route: Router) => {
    Route.post('/customer/register', regisCustomer)
}

export default customerRoutes
