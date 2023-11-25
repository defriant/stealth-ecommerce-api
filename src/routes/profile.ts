import { Router } from 'express'
import { profileDetail, updateProfile } from '../controllers/ProfileController'
import userRole from '../middlewares/userRole'

const profileRoute = Router({ mergeParams: true })

profileRoute.get('/', profileDetail)
profileRoute.put('/update', userRole.customer, updateProfile)

export default profileRoute
