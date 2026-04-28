const express = require("express");
const notesModel = require("./models/notes.model");

const app = express();
app.use(express.json());

// API CHECK
app.get("/", (req, res) => {
  res.send("API is Running all Fine!!");
});

// CREATE NOTE API
app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;

  const notes = await notesModel.create({
    title,
    description,
  });

  res.status(201).json({
    messaage: "Notes Created Successfuly",
    notes: notes,
  });
});

// FETCH ALL NOTES
app.get("/api/notes", async (req, res) => {
  const notes = await notesModel.find();

  res.send(notes);

  res.status(200).json({
    message: "All Notes Fetched Successsfully",
    notes,
  });
});

// DELETE NOTE BY ID
app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  await notesModel.findByIdAndDelete(id);

  res.status(204).json({
    message: "Note Deleted Successfully",
  });
});

// EDIT NOTE'S DESCRIPTION BY ID
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  await notesModel.findByIdAndUpdate(id, { description });

  res.status(200).json({
    message: "Note Updated Successfully",
  });
});

module.exports = app;
