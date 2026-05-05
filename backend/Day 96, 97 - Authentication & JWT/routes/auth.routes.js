const express = require('express')
const userModel = require('../models/user.model.js')

const authRouter = express.Router()

authRouter.post('/register', async (req, res) => {
    const {name, email, password} = req.body

    const user = await userModel.create({
        name, email, password
    })

    res.status(201).json({
        message: "User Registered Successfully!!",
        user
    })
})


module.exports = authRouter