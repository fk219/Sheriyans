const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    res.status(400).json({
      message: "User with this Email Already Exists, Try Login!!",
    });
  }

  const hashedPassword = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  res.cookie("jwt_secret", token);

  res.status(201).json({
    message: "User Created Successfully",
    token,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const isUser = await userModel.findOne({ email });

  if (!isUser) {
    res.status(404).json({
      message: "User Does Not Exist!!",
    });
  }

  const hashedPassword = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  const isPasswordMatched = isUser.password === hashedPassword;

  if (!isPasswordMatched) {
    res.status(400).json({
      message: "Password Does Not Match!!",
    });
  }

  const token = jwt.sign(
    {
      id: isUser._id,
      email: isUser.email,
    },
    process.env.JWT_SECRET
  );

  res.cookie("jwt_secret", token);

  res.status(200).json({
    message: "User Logged In Successsfully!!",
    token,
  });
});

authRouter.post("/get-me", async (req, res) => {
  const token = req.cookies.jwt_secret;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decodedToken.id);

  res.status(201).json({
    token,
    decodedToken,
    user,
  });
});

module.exports = authRouter;
