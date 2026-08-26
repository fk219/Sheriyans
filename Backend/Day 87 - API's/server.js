const express = require('express')

const app = express();

app.use(express.json())

const notes = []

app.get('/notes', (req, res)=>{
    res.send(notes)
})

app.post('/notes', (req, res)=>{
    console.log(req.body)
    notes.push(req.body)
    res.send("Note Created Successfully!!")
})

app.listen(3000, ()=>{
    console.log("Server is running at http://localhost:3000")
})