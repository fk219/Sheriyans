const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: [true, "Email Already Exists!!"],
  },
  password: String,
});

const useModel = mongoose.model("users", userSchema);

module.exports = useModel;
