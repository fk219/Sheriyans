const express = require("express")
const multer = require("multer")
const { createPostController, getAllPostController, getPostDetailController } = require("../controllers/post.controller")
const {identifyUser} = require("../middleware/auth.middleware")

const upload = multer({storage: multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post("/", upload.single('image'), createPostController)
postRouter.get("/", identifyUser, getAllPostController)
postRouter.post("/:postId", identifyUser, getPostDetailController)

module.exports = postRouter