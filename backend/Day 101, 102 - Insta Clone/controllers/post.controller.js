const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekitInstance = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
        // console.log(req.body, req.file)
        
       let decoded;
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: "Token Not Provided! Unauthorised Access!!"
            })
        }

        try{
             decoded = jwt.verify(token, process.env.JWT_SECRET)
        }catch (err){
            return res.status(401).json({
                message: "Unauthorised Access!"
            })
        }

        const file = await imagekitInstance.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
            fileName: req.file.originalname,
            folder: "insta-clone"
        })

        const post = await postModel.create({
            caption: req.body.caption,
            image_url: file.url,
            user: decoded.id
        })

        res.status(201).json({
            message: "Post Created Successfully",
            post
        })
}

const getPostController = async (req, res) => {
    const token = req.cookies.token
    
    if(!token){
        return res.status(409).json({
            message: "Please Login First!"
        })
    }

    let decoded = null;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Unauthorised Access!"
        })
    }

    const userId = decoded.id

    const posts = await postModel.find({
        user: userId
    })
    
    res.status(201).json({
        message: "All Posts Fetched Successfully",
        posts
    })
}

const getPostDetailsController = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorised Access! No Token Present!"
        });
    }

    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised Access"
        });
    }
    
    const userId = decoded.id;

    const post = await postModel.findById(req.params.postId);

    if (!post) {
        return res.status(404).json({
            message: "Post Not Found"
        });
    }

    const isValidUser = post.user.toString() === userId;

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
