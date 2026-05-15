const postModel = require("../model/post.model")
const imageKit = require("@imagekit/nodejs/index.js")
const toFile = require("@imagekit/nodejs/index.js")

const imageKitInstance = new imageKit({
    private_key: process.env.IMAGEKIT_PRIVATE_KEY
})

const createPostController = async (req, res) => {

    const file = await imageKitInstance.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
        fileName: req.file.originalname,
        folder: "insta-clone"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        image: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "Post Created Successfully",
        post
    })
}

const getAllPostController = async (req, res) => {
    const posts = await postModel.find({
        user: req.user.id
    }) 
    res.status(201).json({
        message: "All Posts Fetched Successfully",
        posts
    })
}

const getPostDetailController = async (req, res) => {
    const post = await postModel.findById(req.params.postId)
    if(!post){
        return res.status(404).json({
            message: "Post Not Found"
        })
    }

    const isValidUser = post.user.toString() === req.user.id

    if(!isValidUser){
        return res.status(403).json({
            message: "Forbidden Content: You can only view your own posts."
        })
    }

    res.status(200).json({
        message: "Post Details Fetched Successfully",
        post
    })

}

module.exports = {
    createPostController,
    getAllPostController,
    getPostDetailController
}

