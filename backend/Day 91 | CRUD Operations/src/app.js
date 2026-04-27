const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// API is running
app.get("/", (req, res) => {
  res.send("API is running");
});

app.post();

module.exports = app;
