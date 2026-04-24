const express = require("express");

const app = express();
app.use(express.json());

const notes = [];

// GET API
app.get("/", (req, res) => {
  res.send("Hello Furqan");
});

// POST API
app.post("/notes", (req, res) => {
  notes.push(req.body);
  console.log("Notes Added Successfully!");
});

// GET API
app.get("/notes", (req, res) => {
  res.send(notes);
});

// DELETE API
app.delete("/notes/:index", (req, res) => {
  delete notes[req.params.index];
  res.send("Notes Deleted Successfully!");
});

// UPDATE API
app.patch("/notes/:index", (req, res) => {
  notes[req.params.index].description = req.body.description;
  res.send("Notes Updated Successfully!");
});

module.exports = app;
