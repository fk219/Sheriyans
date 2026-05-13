const express = require("express")
const followUserController = require("../controllers/user.controller")
const identifyUser = require("../middleware/auth.middleware")

const userRouter = express.Router()

/**
 * @route POST /api/user/follow/:userid
 * @description Follows a User
 * @access Private
 */

userRouter.post("/follow/:username", identifyUser, followUserController)

module.exports = userRouter