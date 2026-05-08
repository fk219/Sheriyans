require('dotenv').config()

const app = require("./src/app")
const connectToDb = require("./config/database")

const port = 3006

connectToDb()
app.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})

