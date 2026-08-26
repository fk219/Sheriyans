const mongoose = require('mongoose')


const connectToDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Your Databse is Connected Successfully!!")
    })
}

module.exports = connectToDb