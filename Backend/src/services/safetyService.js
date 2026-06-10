import { GoogleGenerativeAI } from '@google/generative-ai'
import redis from '../config/redis.js'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })
const SAFETY_TTL = 3600 // ← NEW: 1 hour cache
export const getRouteSafetyAdvisory = async (routeData) => {
    const { start, end, totalDistanceKm, estimatedTravelTime, fuelStops } = routeData
     // ← NEW: check cache first
    const cacheKey = `safety:${start.toLowerCase()}:${end.toLowerCase()}`
    try {
        const cached = await redis.get(cacheKey)
        if(cached){
            console.log(`⚡ Safety cache HIT for ${cacheKey}`)
            return JSON.parse(cached)
        }
    } catch(cacheErr) {
        console.warn('⚠️ Redis unavailable for safety cache:', cacheErr.message)
    }
    // build weather summary for prompt
    const weatherSummary = fuelStops
        .filter(s => s.weather?.temperature)
        .map(s => `${s.city}: ${s.weather.temperature}°C, ${s.weather.description}`)
        .join('\n')

    // craft the prompt
    const prompt = `
You are a road safety expert for Indian highways. Analyze this journey and provide safety advice.

JOURNEY DETAILS:
- Route: ${start} to ${end}
- Distance: ${totalDistanceKm} km
- Estimated Travel Time: ${estimatedTravelTime.formatted}
- Number of fuel stops: ${fuelStops.length}

WEATHER CONDITIONS ALONG ROUTE:
${weatherSummary}

Provide a safety advisory in this EXACT JSON format (no markdown, no backticks, just pure JSON):
{
    "safetyScore": <number 0-100, higher is safer>,
    "verdict": "<Safe | Moderate Risk | High Risk>",
    "warnings": [<3-4 specific warnings based on the route and weather>],
    "recommendations": [<3-4 actionable recommendations>],
    "bestDepartureTime": "<specific time recommendation>",
    "estimatedRestStops": <number of recommended rest stops>
}
`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // parse JSON response
        const cleaned = text.replace(/```json|```/g, '').trim()
        const advisory = JSON.parse(cleaned)
        console.log(advisory);
        // ← NEW: store in Redis
        try {
            await redis.set(cacheKey, JSON.stringify(advisory), 'EX', SAFETY_TTL)
            console.log(`✅ Safety advisory cached for 1 hour`)
        } catch(cacheErr) {
            console.warn('⚠️ Could not cache safety advisory:', cacheErr.message)
        }

        return advisory

    } catch(err) {
        console.error('❌ AI Safety Advisory failed:', err.message)
        // graceful fallback
        return {
            safetyScore: 70,
            verdict: 'Moderate Risk',
            warnings: [
                'Long distance journey — stay alert',
                'Take regular breaks every 3-4 hours',
            ],
            recommendations: [
                'Check vehicle before departure',
                'Keep emergency contacts ready',
                'Stay hydrated throughout journey'
            ],
            bestDepartureTime: 'Early morning 5-6 AM',
            estimatedRestStops: Math.floor(totalDistanceKm / 400)
        }
    }
}