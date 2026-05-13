const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username Already Exists"],
        required: [true, "Username is Required"]
    },
    email: {
        type: String,
        unique: [true, "Duplicate Email Found!"],
        required: [true, "Email is Required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    bio: String,
    profile_image: {
        type: String,
        default: "https://ik.imagekit.io/fk219/default_profile.png"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel