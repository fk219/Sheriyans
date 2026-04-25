const app = require("./src/app");
const mongoose = require("mongoose");

const port = 3000

const connectDb = () => {
    mongoose.connect("mongodb+srv://furqank219_db_user:bQ6c0vlGuYR5CWbt@cluster0.am1btqe.mongodb.net/day_90").then(
        () => {
            console.log("Connected to Database Successfully!!")
        }
    )
}
connectDb()

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})