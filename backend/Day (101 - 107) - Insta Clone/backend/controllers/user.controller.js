const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

const followUserController = async (req, res) => {
    const followerUsername = req.user.username 
    const followeeUsername = req.params.username

    // Preventing to follow ourelves
    if(followerUsername === followeeUsername){
        return res.status(400).json({
            message: "You cannot Follow Yourself"
        })
    }

    // Checking if the user we are trying to follow exists?
    const doesUserExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!doesUserExists){
        return res.status(404).json({
            message: "User You are Trying to Follow A User Who Does Not Exists"
        })
    }

    // Preventing Duplicate Following 
    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername, 
        followee: followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message: "You are already Following this User",
            isAlreadyFollowing
        })
    }

    // Creating Follow Record
    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    return res.status(201).json({
        message: `User ${followerUsername} is now following ${followeeUsername}`,
        follow: followRecord
    })

}

const unfollowUserController = async (req, res) => {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!isFollowing){
        return res.status(200).json({
            message: "You need to Follow first to unfollow"
        })
    }

    await followModel.findByIdAndDelete(isFollowing._id)

    return res.status(200).json({
        message: `You have successfully unfollowed ${followeeUsername}`
    });

}

module.exports = { followUserController, unfollowUserController }