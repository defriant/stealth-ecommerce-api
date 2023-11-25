import { Router } from 'express'
import { productDetail, productList } from '../controllers/ProductController'

const productsRoute = Router({ mergeParams: true })

productsRoute.get('/', productList)
productsRoute.get('/:id', productDetail)

export default productsRoute
