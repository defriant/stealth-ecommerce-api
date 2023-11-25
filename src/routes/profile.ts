import { Router } from 'express'
import { profileDetail, updateProfile } from '../controllers/ProfileController'

const profileRoute = Router({ mergeParams: true })

profileRoute.get('/', profileDetail)
profileRoute.put('/update', updateProfile)

export default profileRoute
