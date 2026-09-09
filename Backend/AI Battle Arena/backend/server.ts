import {app} from './src/app.ts'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is Running on https://localhost:${PORT}`)
})