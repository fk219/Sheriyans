const express = require("express")
const {createPostController, getPostController, getPostDetailsController, likePostController, getFeedController} = require("../controllers/post.controller")
const indentifyUser = require("../middleware/auth.middleware")

const multer = require("multer")
const identifyUser = require("../middleware/auth.middleware")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), indentifyUser, createPostController)
postRouter.get('/', indentifyUser, getPostController)
postRouter.post('/details/:postId', indentifyUser, getPostDetailsController)

postRouter.post('/like/:postId', indentifyUser, likePostController)

postRouter.get('/feed', identifyUser, getFeedController)


module.exports = postRouter


