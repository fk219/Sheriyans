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

        if (stream) {
            res.status(200)
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.flushHeaders()

            const sendEvent = (data) => {
                res.write(`data: ${JSON.stringify(data)}\n\n`)
            }

            sendEvent({
                type: 'start',
                title,
                newChat,
                userMessage,
                chatId: currentChatId
            })

            const chatMessages = await messageModel.find({chat: currentChatId}).sort({createdAt: 1})
            const result = await generateResponse(chatMessages, (chunk) => {
                sendEvent({ type: 'chunk', chatId: currentChatId, chunk })
            })

            const aiMessage = await messageModel.create({
                chat: currentChatId,
                content: result,
                role: "ai"
            })

            sendEvent({ type: 'done', message: aiMessage })
            return res.end()
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
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({type: 'error', error: error.message})}\n\n`)
            return res.end()
        }
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


    // IMPORTANT: sort by createdAt so the chat thread always renders in
    // chronological order (user -> AI -> user -> AI ...) and never jumbled
    const messages = await messageModel.find({
        chat: chatId
    }).sort({createdAt: 1})

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