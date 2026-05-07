const express = require('express');
const userModel = require('../models/user.model');
const crypto = require('crypto')
const jwt= require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/register', async (req, res) => {
    const {username, email, password, bio, profileImage} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    }) 

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "User Already Exists with Same Email or Username! " + (isUserAlreadyExists.email === email ? "Email Already Exists" : "Username Already Exists!")
        })
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        bio,
        profileImage
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token)

    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profile_image
        }
    })

})

authRouter.post('/login', async (req, res) => {
    // Login logic will go here
})



module.exports = authRouter