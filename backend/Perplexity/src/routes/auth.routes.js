import express from 'express'

import { validateRegister, validateLogin } from '../validator/auth.validator.js'
import { registerController, verifyEmailController, loginController } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register', validateRegister, registerController)
authRouter.get('/verify-email', verifyEmailController)
authRouter.post('/login', validateLogin, loginController)


export {authRouter}