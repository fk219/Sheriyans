import express from 'express'
import { identifyUser } from '../middleware/auth.middleware.js'
import {sendMessages, getChats, getMessages, deleteChat} from '../controllers/chat.controller.js'


const chatRouter = express.Router()

chatRouter.post('/message', identifyUser, sendMessages)
chatRouter.get('/', identifyUser, getChats)
chatRouter.get('/:chatId/messages', identifyUser, getMessages)
chatRouter.delete('/delete/:chatId', identifyUser, deleteChat)

export default chatRouter