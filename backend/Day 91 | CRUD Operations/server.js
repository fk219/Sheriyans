const app = require('./src/app')
const port = 3000;

app.listen(port, () => {
    console.log(`The Server is Running at http://localhost:${port}`)
})