const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')

const identifyUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: 'No Token Provided, Please Login/ Register!'
        })
    }

    const isTokenBlacklisted = await blacklistModel.findOne({token})

    if(isTokenBlacklisted){
        return res.status(400).json({
            message: "Invalid Token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        return next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = identifyUser

