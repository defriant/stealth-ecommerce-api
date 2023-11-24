import { Response, Router } from 'express'
import customerRoutes from './customer'

const Route = Router()

const routes = (): Router => {
    customerRoutes(Route)

    Route.all('/*', (_, res: Response) => res.status(404).json({ message: 'Resource not found' }))

    return Route
}

export default routes
