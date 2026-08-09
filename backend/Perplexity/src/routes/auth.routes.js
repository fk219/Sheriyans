import express from 'express'

import { validateRegister } from '../validator/auth.validator.js'
import { registerController, verifyEmailController } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register', validateRegister, registerController)
authRouter.get('/verify-email', verifyEmailController)


export {authRouter}