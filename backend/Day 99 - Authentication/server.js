require('dotenv').config()

const connectToDb = require('./config/database')
const app = require('./src/app')

const port = 3000


connectToDb()
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})