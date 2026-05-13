const postModel = require("../models/post.model")
const identifyUser = require("../middleware/auth.middleware")

const ImageKit = require("@imagekit/nodejs/index.js")
const { toFile } = require("@imagekit/nodejs/index.js")

const imagekitInstance = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
        // console.log(req.body, req.file)
        
        const file = await imagekitInstance.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
            fileName: req.file.originalname,
            folder: "insta-clone"
        })

        const post = await postModel.create({
            caption: req.body.caption,
            image_url: file.url,
            user: req.user.id
        })

        res.status(201).json({
            message: "Post Created Successfully",
            post
        })
}

const getPostController = async (req, res) => {
    
    const posts = await postModel.find({
        user: req.user.id
    })
    
    res.status(201).json({
        message: "All Posts Fetched Successfully",
        posts
    })
}

const getPostDetailsController = async (req, res) => {

    const post = await postModel.findById(req.params.postId);

    if (!post) {
        return res.status(404).json({
            message: "Post Not Found"
        });
    }

    const isValidUser = post.user.toString() === req.user.id;

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content: You can only view your own posts."
        });
    }

    res.status(200).json({
        message: "Post Details Fetched Successfully",
        post
    });
};


module.exports = {
    createPostController, 
    getPostController,
    getPostDetailsController
}
