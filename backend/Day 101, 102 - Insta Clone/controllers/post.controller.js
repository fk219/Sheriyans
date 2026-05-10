const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekitInstance = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
        console.log(req.body, req.file)
        
        const file = await imagekitInstance.files.upload({
            file: await toFile(req.file.buffer, req.file.originalname),
            fileName: req.file.originalname
        })

        res.send({
            file: file
        })
}

module.exports = {
    createPostController
}