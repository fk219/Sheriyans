const express = require("express")
const {registerController, loginController, logoutController, getMeController} = require('../controllers/auth.controller')
const identifyUser = require('../middleware/auth.middleware')

const authRouter = express.Router()

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.get('/logout', identifyUser, logoutController)
authRouter.get('/get-me', identifyUser, getMeController)

module.exports = authRouter