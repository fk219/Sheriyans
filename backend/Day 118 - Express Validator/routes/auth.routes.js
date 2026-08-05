import express from 'express'
import {registerController} from '../controllers/auth.controller.js'
import {body, validationResult} from 'express-validator'



const authRouter = express.Router()


authRouter.post('/register',[
    body('username').isString().withMessage("Username Should be a String Bastard"),
    body('email').isEmail().withMessage("Email Daal gandu"),

    (req, res, next) => {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            return next()
        }

        res.status(400).json({
            errors: errors.array()
        })
    }
],registerController)


export {authRouter}


