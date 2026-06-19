const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: [true, "Account Cannot be Created Without Username!!"],
        unique: [true, "Account with Username Already Exists!!"]
        
    },
    email: {
        type: String,
        required: [true, "Account Cannot be Created Without Email!!"],
        unique: [true, "Account with Email Already Exists!!"]
        
    },
    password: {
        type: String,
        required: [true, "Account Cannot be Created Without Password!!"]
    },
    profile_Image: {
        type: String,
        default: "https://ik.imagekit.io/fk219/default_profile.png"
        
    },
    bio: {
        type: String
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel