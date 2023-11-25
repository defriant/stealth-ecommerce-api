import { Response, Router } from 'express'
import customerRoutes from './customer'
import authRoutes from './auth'
import productRoute from './product'

const Route = Router()

const routes = (): Router => {
    authRoutes(Route)
    productRoute(Route)
    customerRoutes(Route)

    Route.all('/*', (_, res: Response) => res.status(404).json({ message: 'Resource not found' }))

    return Route
}

export default routes
