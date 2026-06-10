import { planFuelStops } from "../services/routePlanner.js"
import redis from "../config/redis.js"

export const planRoute = async (req, res) => {
    const start = req.body.start?.trim()
    const end = req.body.end?.trim()
    const vehicleType = req.body.vehicleType || 'car'

    // include vehicleType in cache key
    const cacheKey = `route:${start.toLowerCase()}:${end.toLowerCase()}:${vehicleType}`

    try {
        // check cache first
        try {
            const cached = await redis.get(cacheKey)
            if(cached){
                console.log(`⚡ Cache HIT for ${cacheKey}`)
                return res.status(200).json({
                    ...JSON.parse(cached),
                    fromCache: true
                })
            }
        } catch(cacheErr) {
            console.warn('⚠️ Redis unavailable, skipping cache:', cacheErr.message)
        }

        // cache miss — calculate
        console.log(`🔄 Cache MISS for ${cacheKey}`)
        const result = await planFuelStops(start, end, vehicleType)

        // store in cache
        try {
            await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600)
        } catch(cacheErr) {
            console.warn('⚠️ Could not store in cache:', cacheErr.message)
        }

        return res.status(200).json(result)

    } catch(err) {
        return res.status(500).json({
            error: "Something went wrong",
            message: err.message
        })
    }
}