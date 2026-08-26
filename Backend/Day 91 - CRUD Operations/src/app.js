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
app.post("/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await notesModel.create({
    title,
    description,
  });
  res.status(201).json({
    message: "Notes Created Successfully!!",
    notes,
  });
});

// Fetch all the notes
app.get("/notes", async (req, res) => {
  const notes = await notesModel.find();
  res.send(notes);
  res.status(200).json({
    message: "All the Notes are mentioned below",
    notes,
  });
});

module.exports = app;
