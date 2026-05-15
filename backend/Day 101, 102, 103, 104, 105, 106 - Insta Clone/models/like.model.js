const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: [true, "Post ID is Required for Creating Like"]
    },
    user: {
        type: String,
        required: [true, "Username is Required for Creating Like"]
    }
}, {
    timeStamp: true
})

likeSchema.index({post:1, user:1}, {unique: true})

const likeModel = mongoose.model("Likes", likeSchema)

module.exports = likeModel