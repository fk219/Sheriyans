const express = require("express");
const path = require("path");

const notesModel = require("./models/notes.model");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// API CHECK
// app.get("/", (req, res) => {
//   res.send("API is Running all Fine!!");
// });

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

  res.status(200).json({
    message: "All Notes Fetched Successsfully",
    notes: notes,
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

// Wild Card Route
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

module.exports = app;
