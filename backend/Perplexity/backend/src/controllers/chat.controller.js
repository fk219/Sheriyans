import {generateResponse} from '../services/ai.services.js'

const messageController = async (req, res) => {
    try{
        const {message} = req.body
        
        const result = await generateResponse(message)
    
        res.status(201).json({
            message: result
        })
        
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

export {messageController}
