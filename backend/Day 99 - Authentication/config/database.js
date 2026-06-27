const mongoose = require('mongoose')

const connectToDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Databse is Connected!")
    })
}

module.exports = connectToDb