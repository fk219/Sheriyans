const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        require: [true, "Caption Is Required"]
    },
    image: {
        type: String,
        require: [true, "Images is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "Post Must be Associated to a User!"]
    }

})

const postModel = mongoose.model("Posts", postSchema)

module.exports = postModel