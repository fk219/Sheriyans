const express = require("express");
const mongoose = require("mongoose");
const notesModel = require("./models/notes.model");
 

const app = express();
app.use(express.json());

// API is running
app.get("/", (req, res) => {
  res.send("API is running");
});


// Create Notes
app.post("/notes", async (req, res)=>{
  const {title, description} = req.body;

  const note = await notesModel.create({
    title, description
  })

  res.status(201).json({
    message: "Notes Created Successfully",
    note
  })
})


module.exports = app;
