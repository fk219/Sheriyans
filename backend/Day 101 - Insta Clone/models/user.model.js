const mongoose = require('mongoose')

const userSchema = new mongooseSchema({
    username: String,
    email: {
        type: String,
        unique: [true, "Duplicate Email Found!"]
    },
    password: string,
    bio: String,
    followers: Array,
    profile_image: String
})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel