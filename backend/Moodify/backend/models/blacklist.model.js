const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is Required'],
        unique: [true, "Token Already Blackisted"]      
    }
}, {
    timestamps: true
})


const blacklistModel = mongoose.model('backlist', blacklistSchema)

module.exports = blacklistModel