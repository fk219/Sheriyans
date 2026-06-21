const express = require("express");
const identifyUser = require("../middleware/auth.middleware")
const {
  registerController,
  loginController,
  getMeController
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("get-me", identifyUser ,getMeController)

module.exports = authRouter;
