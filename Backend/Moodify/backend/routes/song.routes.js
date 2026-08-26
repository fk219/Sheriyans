const express = require('express')
const upload = require('../middleware/upload.middleware')
const {songUpload, getSong} = require('../controllers/song.controller') 

const songRouter = express.Router()

songRouter.post('/', upload.single("song"), songUpload)
songRouter.get('/', getSong)

module.exports = songRouter
