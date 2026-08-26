const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email : {
        type: String,
        unique: [true, 'Email Already Registered'],
    },
    password: String
})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel