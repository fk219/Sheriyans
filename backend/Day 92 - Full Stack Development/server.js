require('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/config/database')
const port = 3000



connectToDb()

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`)
})