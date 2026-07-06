const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerController = async (req, res) => {
    const {username, email, password} = req.body

    const userAlreadyExists = await userModel.find({
        $or: [
            {username}, {email}
        ]
    })

    if(userAlreadyExists){
        return res.status().json({
            Message: userAlreadyExists.email == email ? "Email Already Exist. " : "Username Already Exists. " + "Please Login Instead"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, 
        email,
        hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, )

    res.cookie('token', token)

    res.status(208).json({
        message: "User Registered Successfully!",
        user
    }, preocess.env.JWT_SECRET, {
        expiredIn: "1d"
    })
}

const loginController = (req, res) => {

}

module.exports = {
    registerController,
    loginController
}