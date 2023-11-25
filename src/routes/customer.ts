import { Router } from 'express'

const customerRoute = Router({ mergeParams: true })

customerRoute.post('/cart/add', (_, res) => res.json({ message: 'cart' }))

export default customerRoute
