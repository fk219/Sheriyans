const mongoose = require('mongoose')

const connectDb = () => {
    return mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database is Connected!')
    })
    .catch((err)=>{
        console.log(`Error Connecting to Database. Error:`, err)
    })
}

module.exports = connectDb