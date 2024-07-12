import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({ extended:true,limit:"25kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// import routes

import studentRouter from './routes/student.routes.js'
import teacherRouter from './routes/teacher.routes.js'

app.use("/api/student",studentRouter)
app.use("/api/teacher",teacherRouter)


export default app;