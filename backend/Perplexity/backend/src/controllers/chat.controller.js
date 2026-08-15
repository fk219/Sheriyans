import {generateResponse} from '../services/ai.services.js'
import { generateTitle } from '../services/ai.services.js'
import {chatModel} from '../models/chat.model.js'
import {messageModel} from '../models/message.model.js'

const messageController = async (req, res) => {
    try{
        const {message, chat: chatId} = req.body
        let title = null, newChat = null;
        
        if(!chatId){
            title = await generateTitle(message)

            newChat = await chatModel.create({
                title: title,
                user: req.user.id
            })
        }

        const currentChatId = chatId || newChat._id 
        
        const userMessage = await messageModel.create({
            chat: currentChatId,
            content: message,
            role: "user"
        })
        
        const chatMessages = await messageModel.find({chat: currentChatId}).sort({createdAt: 1})
        
        const result = await generateResponse(chatMessages)

        const aiMessage = await messageModel.create({
            chat: currentChatId,
            content: result,
            role: "ai"
        })

        res.status(201).json({
            title: title,
            newChat: newChat,
            userMessage: userMessage,
            aiMessage: aiMessage
        })

    }catch(error){
        res.status(500).json({error: error.message})
    }
}

export {messageController}