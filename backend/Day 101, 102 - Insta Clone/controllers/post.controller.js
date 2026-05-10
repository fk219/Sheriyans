const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekitInstance = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
        // console.log(req.body, req.file)
        
        const file = await imagekitInstance.files.upload({
            file: await toFile(req.file.buffer, req.file.originalname),
            fileName: req.file.originalname
        })

        const token = req.cookies.token;

        if(!token){
            res.status(401).json({
                message: "Unauthorised Access!!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const post = await postModel.create({
            caption: req.body.caption,
            image_url: file.url,
            user: decoded.id
        })

        res.status(201).json({
            message: "Post Created Successfully"
        })

}

module.exports = {
    createPostController
}