const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { username, email, password, bio, profileImage } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "User Already Exists: " +
        (isUserAlreadyExists.email === email
          ? "Email Already Exists"
          : "Username Already Exists!"),
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    bio,
    profileImage,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profile_image,
    },
  });
};

const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return res.status(409).json({
      message: "User is not found!",
    });
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password)

  if (!doesPasswordMatch) {
    return res.status(401).json({
      message: "Incorrect Password!!",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User Logged In Successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profile_image,
    },
  });
};

const getMeController = async(req, res) => {
  const userId = req.user.id
  const user = await userModel.findById(userId)
  
  res.status(200).json({
    username: user.username,
    email: user.email,
    bio: user.bio,
    profileImage: user.profile_image
  })
}

module.exports = {
  registerController,
  loginController,
  getMeController
};
