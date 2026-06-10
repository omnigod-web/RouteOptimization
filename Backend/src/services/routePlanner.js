import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvtojson from 'csvtojson';
import { routeConfig } from '../config/routeConfig.js';
import { vehicleProfiles, defaultVehicle } from '../config/vehicleConfig.js';
import { getWeatherForCities } from './weatherService.js'
import { getRouteSafetyAdvisory } from './safetyService.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Load data files ONCE at startup ──────────────────────────────────────────
const stationsRaw = fs.readFileSync(
    path.join(__dirname, '../../data/geocoded_stations.json'), 'utf8'
)
const stations = JSON.parse(stationsRaw)
const prices = await csvtojson().fromFile(
    path.join(__dirname, '../../data/fuel_prices.csv')
)

// ── Haversine Formula ─────────────────────────────────────────────────────────
const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Travel Time Calculator ────────────────────────────────────────────────────
const calculateTravelTime = (distanceKm) => {
    const totalHours = distanceKm / routeConfig.averageSpeed
    const hours = Math.floor(totalHours)
    const minutes = Math.round((totalHours * 60) % 60)
    return {
        hours,
        minutes,
        formatted: `${hours}h ${minutes}m`
    }
}

// ── Main Service ──────────────────────────────────────────────────────────────
export const planFuelStops = async (start, end, vehicleType = defaultVehicle) => {

    // get vehicle profile
    const vehicle = vehicleProfiles[vehicleType] || vehicleProfiles[defaultVehicle]

    // 1. find start and end stations
    const startStation = stations.find(s => s.city.toLowerCase() === start.toLowerCase())
    const endStation = stations.find(s => s.city.toLowerCase() === end.toLowerCase())

    if(!startStation || !endStation){
        throw new Error('Cities not found. Please check the city names.')
    }

    // 2. calculate straight line total distance
    const totalDistance = getDistance(
        startStation.lat, startStation.lng,
        endStation.lat, endStation.lng
    )

    // 3. filter stations along the route corridor
    const routeStations = stations.filter(s => {
        const distFromStart = getDistance(startStation.lat, startStation.lng, s.lat, s.lng)
        const distFromEnd = getDistance(s.lat, s.lng, endStation.lat, endStation.lng)
        return (distFromStart + distFromEnd) <= (totalDistance + routeConfig.corridorWidth)
    })

    // 4. merge fuel prices into stations
    const stationsWithPrice = routeStations.map(station => {
        const priceData = prices.find(p => parseInt(p.station_id) === station.station_id)
        return {
            ...station,
            petrol_price: priceData ? parseFloat(priceData.petrol_price) : null
        }
    })

    // 5. sort by distance from start
    const sorted = stationsWithPrice.sort((a, b) => {
        const distA = getDistance(startStation.lat, startStation.lng, a.lat, a.lng)
        const distB = getDistance(startStation.lat, startStation.lng, b.lat, b.lng)
        return distA - distB
    })

    // 6. greedy algorithm — using vehicle tank range
    const fuelStops = []
    let lastStopLat = startStation.lat
    let lastStopLng = startStation.lng
    let remainingStations = [...sorted]

    while(remainingStations.length > 0){
        const distToEnd = getDistance(
            lastStopLat, lastStopLng,
            endStation.lat, endStation.lng
        )

        const reachable = remainingStations.filter(station => {
            const distFromLast = getDistance(
                lastStopLat, lastStopLng,
                station.lat, station.lng
            )
            const stationDistToEnd = getDistance(
                station.lat, station.lng,
                endStation.lat, endStation.lng
            )
            // use vehicle.tankRange instead of routeConfig.tankRange
            return distFromLast <= vehicle.tankRange && stationDistToEnd < distToEnd
        })

        if(reachable.length === 0) break

        const cheapest = reachable.reduce((best, station) => {
            return station.petrol_price < best.petrol_price ? station : best
        })

        fuelStops.push(cheapest)
        lastStopLat = cheapest.lat
        lastStopLng = cheapest.lng

        const cheapestIndex = remainingStations.indexOf(cheapest)
        remainingStations = remainingStations.slice(cheapestIndex + 1)
    }

    // 7. get weather for all stops in parallel
    const stopCities = fuelStops.map(s => s.city)
    const weatherData = await getWeatherForCities(stopCities)

    const fuelStopsWithWeather = fuelStops.map((stop, i) => ({
        city: stop.city,
        station: stop.station_name,
        petrol_price: `₹${stop.petrol_price}`,
        lat: stop.lat,
        lng: stop.lng,
        weather: weatherData[i]
    }))

    // 8. calculate total cost using vehicle mileage
    const allPoints = [
        { lat: startStation.lat, lng: startStation.lng },
        ...fuelStops,
        { lat: endStation.lat, lng: endStation.lng }
    ]

    let totalCost = 0
    for(let i = 0; i < allPoints.length - 1; i++){
        const segmentDist = getDistance(
            allPoints[i].lat, allPoints[i].lng,
            allPoints[i + 1].lat, allPoints[i + 1].lng
        ) * routeConfig.roadFactor

        const litres = segmentDist / vehicle.mileage  // ← vehicle mileage!

        const price = allPoints[i + 1].petrol_price
            || fuelStops[fuelStops.length - 1]?.petrol_price
            || 100

        totalCost += litres * price
    }

    // 9. build final response
    const totalDistanceKm = Math.round(totalDistance * routeConfig.roadFactor)
    const estimatedTravelTime = calculateTravelTime(totalDistanceKm)

    // AI safety advisory
    const routeSummary = {
        start, end, totalDistanceKm,
        estimatedTravelTime,
        fuelStops: fuelStopsWithWeather
    }
    const safetyAdvisory = await getRouteSafetyAdvisory(routeSummary)

    return {
        start,
        end,
        vehicle: {
            type: vehicleType,
            label: vehicle.label,
            mileage: vehicle.mileage,
            tankRange: vehicle.tankRange
        },
        totalDistanceKm,
        estimatedTravelTime,
        fuelStops: fuelStopsWithWeather,
        estimatedTotalCost: `₹${totalCost.toFixed(2)}`,
        startCoords: { lat: startStation.lat, lng: startStation.lng },
        endCoords: { lat: endStation.lat, lng: endStation.lng },
        safetyAdvisory
    }
}