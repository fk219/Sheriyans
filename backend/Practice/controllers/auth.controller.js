const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const registerController = async (req, res) => {
    const {username, email, password, bio} = req.body;

    const isAUser = await userModel.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(isAUser){
        return res.status(409).json({
            message: "User Already Exists" 
        })
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        bio
    })
    
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User Created Successfully",
        user
    })

}

const loginController = async (req, res) => {
    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        return res.status(409).json({
            message: "No User Found, Regitser First"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        return res.status(409).json({
            message: "Incorrect Password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Login Successful",
        user
    })  
}


module.exports = {
    registerController,
    loginController
}