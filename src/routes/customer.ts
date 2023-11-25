import { Router } from 'express'
import { addCart, cartList, deleteCart, updateCart } from '../controllers/Customer/CartController'
import { summarizeTransaction, transactionList } from '../controllers/Customer/TransactionController'

const customerRoute = Router({ mergeParams: true })

customerRoute.get('/carts', cartList)
customerRoute.post('/carts/add', addCart)
customerRoute.put('/carts/:id/update', updateCart)
customerRoute.delete('/carts/:id/delete', deleteCart)

customerRoute.get('/transaction', transactionList)
customerRoute.post('/transaction/summarize', summarizeTransaction)

export default customerRoute
