import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('MongoDB is Connected!')
    }).catch((err) => {
        console.error('Error Connecting MongoDb', err)
    })
}

export {connectDB}