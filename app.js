import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoute from './src/routes/user.route.js'

app.use('/api/v1/users',userRoute)

export { app }