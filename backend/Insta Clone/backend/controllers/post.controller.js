const postModel = require("../models/post.model")
const likeModel = require("../models/like.model")

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

const likePostController = async (req, res) => {
    const user = req.user.username;
    const postId = req.params.postId;

    // Does Post the user trying to like Exists?
    const doesPostExist = await postModel.findById(postId)

    if(!doesPostExist){
        return res.status(404).json({
            message: "The Post You are trying to Like Does Not Exists"
        })
    }

    const likedPost = await likeModel.create({
        post: postId,
        user: user
    })

    return res.status(200).json({
        message: "Post Liked Successfully",
        likedPost
    })
}

const getFeedController = async(req, res) => {
    const user = req.user

    const posts = await Promise.all(await postModel.find().populate('user').lean())
    .map(async (post)=>{

        const isLiked = await likeModel.findOne({
            post: post._id,
            user: user
        })

        post.isLiked = !!isLiked //Boolean(isLiked)

        return post
    })


    res.status(200).json({
        message: "Post fetched Successfully",
        posts: posts
    })
}

module.exports = {
    createPostController, 
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController
}
