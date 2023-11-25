import { Router } from 'express'
import { profile } from '../controllers/ProfileController'

const profileRoute = Router({ mergeParams: true })

profileRoute.get('/', profile)

export default profileRoute
