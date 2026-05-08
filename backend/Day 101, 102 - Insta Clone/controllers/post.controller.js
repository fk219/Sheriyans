// const postModel = require("../models/post.model")
// const imageKit = require("@imagekit/nodejs")


// const imagekitInstance = new imageKit({
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
// })

// const createPostController = async (req, res) => {
//     console.log(req.body, req.file)
    
//     const file = await imagekitInstance.files.upload({
//         file: await toFile(Buffer.from(req.file.buffer), 'file'),
//         fileName: req.file.originalname
//     })

//     res.send(file)
// }

// module.exports = {
//     createPostController
// }

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
            url: file.url
        })
}

module.exports = {
    createPostController
}