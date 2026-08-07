import express from 'express'
import {registerController} from '../controllers/auth.controller.js'
import { validateRegister } from '../validator/auth.validator.js'

const authRouter = express.Router()

authRouter.post('/register', validateRegister, registerController)


export {authRouter}