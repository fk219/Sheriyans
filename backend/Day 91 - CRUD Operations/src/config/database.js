const mongoose = require("mongoose");

const connectDb = () => {
    mongoose.connect(
        "mongodb+srv://furqank219_db_user:bQ6c0vlGuYR5CWbt@cluster0.am1btqe.mongodb.net/day_91"
    ).then(
        ()=>{
            console.log("Database is Connected Successfully!!")
        }
    )
}

module.exports = connectDb