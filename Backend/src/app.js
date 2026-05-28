import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { rateLimiter } from './middlewares/rateLimiter.js'
import routeRouter from './routes/route.js'

dotenv.config()

const app = express()  // ← 1. create app FIRST

// 2. then use middlewares
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())
app.use(rateLimiter)

// 3. then routes
app.use('/api', routeRouter)

// 4. health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// 5. start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})