import {userModel} from '../models/user.model.js'
import {sendEmail} from '../services/mail.service.js'


const registerController = async (req, res, next) => {
    const {username, email, password} = req.body
    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        return res.status(400).json({
            message: existingUser.email === email
                ? "User already exists with this email"
                : "User already exists with this username",
            success: false,
            err: "User Already Exists!"
        })
    }

    const user = await userModel.create({
        username, email, password
    })

    try {
        await sendEmail(
            email,
            "Welcome to Perplexity!",
            `<h1>Welcome to Perplexity, ${username}!</h1><p>Thank you for registering with us. We're excited to have you on board!</p>`
        )
    } catch (emailError) {
        console.error("Failed to send welcome email:", emailError)
    }

    res.status(201).json({
        message: "User Registered Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}


export {registerController}