const express = require("express")
const {followUserController, unfollowUserController} = require("../controllers/user.controller")
const identifyUser = require("../middleware/auth.middleware")

const userRouter = express.Router()

/**
 * @route POST /api/user/follow/:userid
 * @description Follows a User
 * @access Private
 */

userRouter.post("/follow/:username", identifyUser, followUserController)
userRouter.post("/unfollow/:username", identifyUser, unfollowUserController)

module.exports = userRouter