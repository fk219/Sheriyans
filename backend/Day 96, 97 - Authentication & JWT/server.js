require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./config/database");
const port = 3002;

connectDb();

app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`);
});
