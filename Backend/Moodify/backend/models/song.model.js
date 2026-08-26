const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterImage: {
        type: String,   
        required: true
    },
    mood: {
        type: String,
        enum: {
            values: ["happy", "sad", "surprised", "neutral"],
            message: "Mood is Required"
        }
    }
})

const songModel = mongoose.model("songs", songSchema)

module.exports = songModel