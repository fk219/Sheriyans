const express = require("express")
const {createPostController, getPostController, getPostDetailsController, getFeedController, likePostController, unLikePostController} = require("../controllers/post.controller")
const identifyUser = require("../middleware/auth.middleware")

const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), identifyUser, createPostController)
postRouter.get('/', identifyUser, getPostController)
postRouter.post('/details/:postId', identifyUser, getPostDetailsController)

postRouter.post('/like/:postId', identifyUser, likePostController)
postRouter.post('/unlike/:postId', identifyUser, unLikePostController)

postRouter.get('/feed', identifyUser, getFeedController)


module.exports = postRouter


