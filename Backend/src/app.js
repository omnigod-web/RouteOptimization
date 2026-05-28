import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { rateLimiter } from './middlewares/rateLimiter.js'
import routeRouter from './routes/route.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}))
app.use(express.json())
app.use(rateLimiter)

app.use('/api', routeRouter)

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

export default app
