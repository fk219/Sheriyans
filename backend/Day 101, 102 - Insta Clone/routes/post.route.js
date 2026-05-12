const express = require("express")
const {createPostController, getPostController, getPostDetailsController} = require("../controllers/post.controller")

const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), createPostController)
postRouter.get('/', getPostController)
postRouter.post('/details/:postId', getPostDetailsController)

module.exports = postRouter