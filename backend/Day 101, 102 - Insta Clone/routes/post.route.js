const express = require("express")
const {createPostController} = require("../controllers/post.controller")

const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), createPostController)

module.exports = postRouter