import {generateResponse} from '../services/ai.services.js'
import { generateTitle } from '../services/ai.services.js'
import {chatModel} from '../models/chat.model.js'
import {messageModel} from '../models/message.model.js'

const sendMessages = async (req, res) => {
    try{
        const {message, chat: chatId, stream} = req.body
        let title = null, newChat = null;
        
        // If this is the first message of a chat (no chatId), generate a title
        // and create a brand-new Chat document for the logged-in user.
        if(!chatId){
            title = await generateTitle(message)

            newChat = await chatModel.create({
                title: title,
                user: req.user.id
            })
        }

        const currentChatId = chatId || newChat._id 
        
        // Always save the user's question first so it survives a refresh
        const userMessage = await messageModel.create({
            chat: currentChatId,
            content: message,
            role: "user"
        })

        // ===================================================================
        // STREAM MODE (used by the Socket.IO live-typing flow)
        // ===================================================================
        // The frontend sends `stream: true` so we DON'T wait for the full AI
        // answer here. We just return the real chatId instantly; the AI answer
        // is then streamed token-by-token through the WebSocket "ask_ai" event.
        // This avoids the "stuck waiting / long REST timer" bug.
        if (stream) {
            return res.status(201).json({
                title: title,
                newChat: newChat,
                userMessage: userMessage,
                chatId: currentChatId,
                stream: true
            })
        }

        // ===================================================================
        // LEGACY MODE (waits for full answer, returns everything at once)
        // ===================================================================
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

    // Sort by most recently updated first so the sidebar shows newest chats on top
    const chats = await chatModel.find({user: user.id}).sort({updatedAt: -1})

    res.status(200).json({
        message: "Chats Fetched Succeesully",
        chats: chats
    })
}

const getMessages = async (req, res) => {
    const {chatId} = req.params

    const chat = await chatModel.findOne({
        user: req.user.id,
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