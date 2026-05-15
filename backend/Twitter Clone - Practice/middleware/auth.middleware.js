const jwt = require("jsonwebtoken")

const identifyUser = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(404).json({
            message: "No Token Found"
        })
    }

    let decodedToken = null
    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        res.status(409).json({
            message: "Invalid Token"
        })
    }

    decodedToken = req.user
    next()
}

module.exports = {
    identifyUser
}