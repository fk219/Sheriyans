import {generateResponse} from '../services/ai.services.js'
import { generateTitle } from '../services/ai.services.js'
import {chatModel} from '../models/chat.model.js'
import {messageModel} from '../models/message.model.js'

const sendMessages = async (req, res) => {
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

const getChats = async (req, res) => {
    const user = req.user

    const chats = await chatModel.find({user: user.id})

    res.status(200).json({
        message: "Chats Fetched Succeesully",
        chats: chats
    })
}

const getMessages = async (req, res) => {
    const {chatId} = req.params

    const chat = await chatModel.findOne({
        user: req.user._id,
        _id: chatId
    })

    if(!chat){
        return res.status(404).json({
            success: false,
            message: "Chat Not Found"
        })
    }


    const messages = await messageModel.find({
        chat: chatId
    })

    return res.status(200).json({
        message: "Messages Fetched Succeesully",
        success: true,
        messages: messages
    })
}

const deleteChat = async (req, res) => {
    const userId = req.user.id
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: userId
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat Not Found",
            success: false
        })
    }

    await messageModel.deleteMany({
        chat: chatId
    })

    res.status(200).json({
        message: "Chat Delleted Successfuly!",
        success: true,
        chat: chatId
    })

    
}

export {sendMessages, getChats, getMessages, deleteChat}