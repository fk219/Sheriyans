const jwt = require("jsonwebtoken");

const identifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorised Access: No Token Provided"
        })
    }

    let decoded = null;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Unauthorised Access: Invalid Token"
        })
    }

    req.user = decoded

    next()
}


module.exports = identifyUser