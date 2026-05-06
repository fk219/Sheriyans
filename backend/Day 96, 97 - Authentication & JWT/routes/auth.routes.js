const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/user.model.js");

const authRouter = express.Router();

// REGISTER API
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already Exist with that Email",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const user = await userModel.create({
    name,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      user: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User Registered Successfully!!",
    user,
    token,
  });
});

// FECTHING ALL COKKIE
authRouter.post("/protected", (req, res) => {
  let tokenInCookie = req.cookies;
  console.log(tokenInCookie);

  res.status(200).json({
    message: "This is Protected Route!",
    tokenInCookie,
  });
});

// LOGIN API
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "Please Create an Account First!!",
    });
  }

  const isPasswordMatch =
    user.password === crypto.createHash("md5").update(password).digest("hex");

  if (!isPasswordMatch) {
    res.status(401).json({
      message: "Incorrect Password Bastard!!",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: email,
    },
    process.env.JWT_SECRET
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    mesage: "User Logged In Successfully!!",
    user,
    token,
  });
});

module.exports = authRouter;
