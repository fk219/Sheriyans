import { userModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"


const identifyUser = async (req, res, next) => {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "No Token Found",
            status: false,
            err: 'No Token Provided'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
        
    }catch(err){
        return res.status(401).json({
            message: "Unauthorised",
            status: false,
            err: "Invalid Token"
        })
    }
}


export {identifyUser}