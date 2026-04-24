const express = require("express");

const app = express();
app.use(express.json());

notes = [];

app.get("/", (req, res) => {
  res.send("Server is Running!!");
});

app.post("/notes", (req, res) => {
  notes.push(req.body);
  res.send("Notes Created Successfully!");
});

app.get("/notes", (req, res) => {
  res.send(notes);
});

module.exports = app;
