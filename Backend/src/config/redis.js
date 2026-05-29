import dotenv from 'dotenv'
import Redis from 'ioredis'

dotenv.config()

const redisToken = process.env.REDIS_TOKEN

if (!redisToken) {
    throw new Error('REDIS_TOKEN is missing. Add it to Backend/.env or Vercel environment variables.')
}

const redis = new Redis(`rediss://default:${redisToken}@neutral-polliwog-139027.upstash.io:6379`, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
        if(times > 3) return null
        return Math.min(times * 200, 1000)
    }
})

redis.on('connect', () => {
    console.log('✅ Redis connected!')
})

redis.on('error', (err) => {
    console.error('❌ Redis error:', err.message)
})

export default redis
