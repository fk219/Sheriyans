import express from 'express'
import { identifyUser } from '../middleware/auth.middleware.js'
import {messageController} from '../controllers/chat.controller.js'


const chatRouter = express.Router()

chatRouter.post('/message', identifyUser, messageController)


export default chatRouter