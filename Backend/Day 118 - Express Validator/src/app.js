import express from 'express'
import { authRouter} from '../routes/auth.routes.js' 
import {errorHandler} from '../middleware/error.middleware.js'


const app = express()

app.use(express.json())
app.use('/api/auth', authRouter)
app.use(errorHandler)


export {app}


