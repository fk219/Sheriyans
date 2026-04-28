const app = require("./src/app");
const connectDb = require("./src/config/database");

const mongoose = require("mongoose");

const port = 3002;

connectDb();

app.listen(port, () => {
  console.log(`The Server is Running at http://localhost:${port}`);
});
