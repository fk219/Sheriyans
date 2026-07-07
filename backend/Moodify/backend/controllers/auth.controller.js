const userModel = require('../models/user.model')
const blacklistModel = require('../models/blacklist.model')

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerController = async (req, res) => {
    const {username, email, password} = req.body

    const userAlreadyExists = await userModel.findOne({
        $or: [
            {username}, {email}
        ]
    })

    if(userAlreadyExists){
        return res.status(400).json({
            Message: userAlreadyExists.email === email
            ? "Email Already Exist. Please Login Instead"
            : "Username Already Exists. Please Login Instead"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, 
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie('token', token)

    res.status(201).json({
        message: "User Registered Successfully!",
        user: {
            id: user._id,
            email: user.email,
            username: user.username 
        }
    })
}

const loginController = async (req, res) => {
    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    }).select("+password")

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username    
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.cookie("token", token)

    return res.status(200).json({
        message: "user Logged In Successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username 
        }
    })
}

const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(400).json({
                message: "No active session found"
            })
        }

        res.clearCookie("token")

        const existingToken = await blacklistModel.findOne({ token })

        if (!existingToken) {
            await blacklistModel.create({ token })
        }

        return res.status(200).json({
            message: "Logout Successfully!"
        })
    } catch (error) {
        console.error("Logout Error:", error)
        return res.status(500).json({
            message: "Logout failed",
            error: error.message
        })
    }
}


const getMeController = async(req, res) => {
    const userId = req.user.id

    const user = await userModel.findById(userId)

    res.status(200).json({
        message: "User Fetched Successfully",
        user
    })
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    getMeController
}