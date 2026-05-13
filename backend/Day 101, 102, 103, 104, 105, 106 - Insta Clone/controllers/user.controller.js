const followModel = require("../models/follow.model")

const followUserController = async (req, res) => {
    const followerUsername = req.user.username 
    const followeeUsername = req.params.username

    const followRecord = await followModel.create({
        follower: followerUsername,
        folowee: followeeUsername
    })

    res.status(201).json({
        message: `User ${followerUsername} is now following ${followeeUsername}`,
        follow: followRecord
    })

}


module.exports = followUserController