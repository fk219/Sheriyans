const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: "",
    },
    image_url: {
        type: String,
        required: [true, "Image URL is Required for creating a post!"]
    },
    user: {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Post must be associated with a user!"]
    }
    
})

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel