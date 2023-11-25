import { Router } from 'express'
import { addCart, cartList, updateCart } from '../controllers/Customer/CartController'

const customerRoute = Router({ mergeParams: true })

customerRoute.get('/carts', cartList)
customerRoute.post('/carts/add', addCart)
customerRoute.put('/carts/:id/update', updateCart)

export default customerRoute
