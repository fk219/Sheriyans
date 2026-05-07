const mongoose = require('mongoose')

const connectToDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=> {
        console.log("Database is Connected")
    })
}

module.exports = connectToDb