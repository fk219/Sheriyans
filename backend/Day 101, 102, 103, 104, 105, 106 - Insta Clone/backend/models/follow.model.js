const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "users",
        required: [true, "Follower is Required!"]
    },
    followee: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "users",
        required: [true, "Followee is Required!"]
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: ["pending", "approved", "rejected"],
            message: "status can only be pending, approved or rejected"
        }
    }
}, {
    timestamps: true
})

followSchema.index({follower: 1, followee: 1}, {unique: true})

const followModel = mongoose.model("Follows", followSchema)

module.exports = followModel