const mongoose = require('mongoose')


const connectDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database is Connected Successfully!!')
    })
}


module.exports = connectDb