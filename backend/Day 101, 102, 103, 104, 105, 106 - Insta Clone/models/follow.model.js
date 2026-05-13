const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "users",
        // required: [true, "Follower is Required!"]
    },
    followee: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "users",
        // required: [true, "Followee is Required!"]
    }
}, {
    timestamps: true
})

const followModel = mongoose.model("Follows", followSchema)

module.exports = followModel