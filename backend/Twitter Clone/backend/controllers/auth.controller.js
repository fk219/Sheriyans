const userModel = require("../models/user.model")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const registerController = async (req, res) => {
    const {username, email, password} = req.body

    const isUserAlreadExists = await userModel.find({
        $or: [{username}, {email}]
    }) 

    if(isUserAlreadExists){
        res.status(409).json({
            message: "User Already Exist with this" + (isUserAlreadExists.email == email ? "Email" : "Username")
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
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message: "User Registered Successfully",
        user
    })
}


const loginController = async (req, res) => {
    const {username, email, password} = req.body;

    const user = userModel.findOne({
        $or: [{email}, {username}]
    })

    if(!user){
        res.status(408).json({
            message: "User Doesnt Exists! Register FIRST!!"
        })
    }

    const isPassowrdMatching = bcrypt.compare(user.password, password)

    if (!isPasswordMatching){
        res.staus(409).json({
            message: "Password is Incorrect"
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        usernamer: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message: "User Logged In Successfully!"
    })

}

module.exports = {
    registerController,
    loginController
}