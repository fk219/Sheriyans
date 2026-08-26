const { ImageKit, toFile } = require("@imagekit/nodejs")

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})


const uploadSong = async ({ buffer, fileName, folder = "" }) => {
    const file = await client.files.upload({
        file: await toFile(Buffer.from(buffer), 'song'),
        fileName,
        folder,
    })

    return file
}


module.exports = { uploadSong }