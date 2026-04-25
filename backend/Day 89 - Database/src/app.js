const express = require("express");

const app = express();
app.use(express.json());

notes = [];

app.get("/", (req, res) => {
  res.send("Server is Running!!");
});

// POST API -----------
app.post("/notes", (req, res) => {
  notes.push(req.body);

  res.status(201).json({
    message: "Notes Created Successfully!!",
  });
});

// GET API ----------
app.get("/notes", (req, res) => {
  res.status(200).json({
    notes: notes,
  });
});

// DELETE API -------
app.delete("/notes/:index", (req, res) => {
  delete notes[req.params.index];

  res.status(204).json({
    message: "Note Deleted Successfully!!",
  });
});

// PATCH API ---------
app.patch("/notes/:index", (req, res) => {
  notes[req.params.index].description = req.body.description;

  res.status(200).json({
    message: "Description Updated Successfully!",
  });
});

module.exports = app;