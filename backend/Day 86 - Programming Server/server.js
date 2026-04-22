const express = require('express')

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello Furqan")
})

app.get('/home', (req, res) => {
    res.send("This is Home Page")
})

app.get('/about', (req, res) => {
    res.send("This is About Page")
})

app.listen(3000, "localhost", () => {
    console.log(`Server is running on http://localhost:3000`);
})
