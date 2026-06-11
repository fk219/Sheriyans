const express = require("express")
const {createPostController, getPostController, getPostDetailsController, likePostController} = require("../controllers/post.controller")
const indentifyUser = require("../middleware/auth.middleware")

const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), indentifyUser, createPostController)
postRouter.get('/', indentifyUser, getPostController)
postRouter.post('/details/:postId', indentifyUser, getPostDetailsController)

postRouter.post('/like/:postId', indentifyUser, likePostController)

module.exports = postRouter