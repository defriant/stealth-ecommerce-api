import { Router } from 'express'
import { productDetail, productList } from '../controllers/ProductController'

const productRoute = (Route: Router) => {
    Route.get('/products', productList)
    Route.get('/products/:id', productDetail)
}

export default productRoute
