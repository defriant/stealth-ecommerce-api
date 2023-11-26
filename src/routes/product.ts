import { Router } from 'express'
import { productDetail, productList, searchProductByName } from '../controllers/ProductController'

const productsRoute = Router({ mergeParams: true })

productsRoute.get('/', productList)
productsRoute.get('/search', searchProductByName)
productsRoute.get('/:id', productDetail)

export default productsRoute
