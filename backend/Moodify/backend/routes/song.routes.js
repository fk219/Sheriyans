const express = require('mongoose')
const upload = require('../middleware/upload.middleware')
const uploadSong = require('../') 

const songRouter = express.Router()

songRouter.post('/', upload.single("song"), )

module.exports = songRouter
