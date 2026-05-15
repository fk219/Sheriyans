const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is Required!"],
        unique: [true, "Username should be Unique!"]
    },
    email:{
        type: String,
        required: [true, "Email is Required!"],
        unique: [true, "Email should be Unique!"]
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
    },
    bio: {
        type: String
    },
    profile_image: {
        type: String,
        default: "https://ik.imagekit.io/fk219/default_profile.png?updatedAt=1778151207977"
    }

})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel
