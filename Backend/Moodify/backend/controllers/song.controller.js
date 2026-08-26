const songModel = require('../models/song.model')
const id3 = require('node-id3')
const storageService = require('../services/storage.service')

const songUpload = async (req, res) => {
    const { mood } = req.body
    const songBuffer = req.file.buffer
    const tags = id3.read(songBuffer)
    const posterBuffer = tags.image.imageBuffer

    const [songFile, posterFile] = await Promise.all([
        storageService.uploadSong({
            buffer: songBuffer,
            fileName: tags.title + ".mp3",
            folder: "/moodify/songs"
        }),
        storageService.uploadSong({
            buffer: posterBuffer,
            fileName: tags.title + ".jpeg",
            folder: "/moodify/posters"
        })
    ])

    const song = await songModel.create({
        url: songFile.url,
        title: tags.title,
        posterImage: posterFile.url,
        mood: mood
    })

    res.status(201).json({
        message: "Song Created Successfully",
        song: song
    })
}

const getSong = async (req, res) => {
    const {mood} = req.query

    const song = await songModel.find({
        mood
    })

    res.status(200).json({
        message: "Song Fetched Successfully",
        song: song
    })
}

module.exports = {
    songUpload,
    getSong
}