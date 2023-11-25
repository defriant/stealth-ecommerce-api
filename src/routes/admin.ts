import { Router } from 'express'
import { addProduct, deleteProduct, updateProduct } from '../controllers/AdminController'

const adminRoute = Router({ mergeParams: true })

adminRoute.post('/product/add', addProduct)
adminRoute.put('/product/:id/update', updateProduct)
adminRoute.delete('/product/:id/delete', deleteProduct)

export default adminRoute
