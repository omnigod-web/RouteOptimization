import redis from "../config/redis.js";
import { planFuelStops } from "../services/routePlanner.js";

export const planRoute =async (req ,res)=>{
    const start= req.body.start?.trim();
    const end = req.body.end?.trim()
    //  if(!start) return res.status(400).json({ error: "start location is required" })
    //  if(!end) return res.status(400).json({ error: "end location is required" })
     if(start.toLowerCase() === end.toLowerCase()) return res.status(400).json({ error: "start and end locations must be different" })
     
        //1.  create cache key
     const cacheKey = `route:${start.toLowerCase()} : ${end.toLowerCase()}`  
     try {
    // try cache first
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
            // ⚠️ Redis is down — log and continue
            console.warn('⚠️ Redis unavailable, skipping cache:', cacheErr.message)
            // don't return! fall through to planFuelStops
        }

        // cache miss OR redis down — calculate normally
        console.log(`🔄 Cache MISS for ${cacheKey}`)
        const result = await planFuelStops(start, end)

        // try to store in cache — but don't fail if Redis is down
        try {
            await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600)
        } catch(cacheErr) {
            console.warn('⚠️ Could not store in cache:', cacheErr.message)
        }

        return res.status(200).json(result)

    } catch(err) {
        return res.status(500).json({
            error: "Something went wrong in routeController",
            message: err.message
        })
    }
}
