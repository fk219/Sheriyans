const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
})

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel