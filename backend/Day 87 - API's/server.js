const express = require('express')

const app = express();


const notes = []

app.post('/notes', (req, res)=>{
    res.send("Note Created Successfully!!")
})

app.listen(3000, ()=>{
    console.log("Server is running at http://localhost:3000")
})