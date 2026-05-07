const express = require('express');
const userModel = require('../models/user.model');
const crypto = require('crypto')
const jwt= require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/regitser', async (req, res) => {
    const {username, email, password, bio, profileImage} = req.body;

    // const isUserExistsByEmail = await userModel.findOne({email})

    // if(!isUserExistsByEmail){
    //     res.status(409).json({
    //         message: "User Already Exists with Same Email!" 
    //     })
    // }

    // const isUserExistsByUsername = await userModel.findOne({username})

    // if(!isUserExistsByUsername){
    //     res.status(409).json({
    //         message: "User Already Exists with Same Username!"
    //     })
    // }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    }) 

    if(isUserAlreadyExists){
        res.status(409).json({
            message: "User Already Exists with Same Email or Username!" + (isUserAlreadyExists.email === email ? "Email Aready Exists" : "Username Already Exists!")
        })
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')

    const user = userModel.create({
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
            username: (await user).username,
            bio: (await user).bio,
            profileImage: user.profileImage
        }
    })

})

authRouter.post('login', async (req, res) => {

})



module.exports = authRouter