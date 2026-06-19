require("dotenv").config()

const app = require("./src/app")
const connectDB = require("./config/database")

const port = 3000

connectDB()
app.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})