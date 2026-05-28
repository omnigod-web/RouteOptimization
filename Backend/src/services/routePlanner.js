import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import  csvtojson  from 'csvtojson';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//To get the total distance between two points on long and lat by using 'HAVERSINE-FORMULA'
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

export const planFuelStops= async (start , end)=>{
            //read geocoded_stations.json
            const filePath = path.join(__dirname , '../../data/geocoded_stations.json');
            const stationsRaw = fs.readFileSync(filePath, 'utf8');
            const stations = JSON.parse(stationsRaw); //RETURN JAVASCRIPT OBJECT
            
            //read fuel_prices.csv

            const prices = await csvtojson().fromFile(
                path.join(__dirname, '../../data/fuel_prices.csv')
            );

            
            const startStation =stations.find(s =>s.city.toLowerCase() === start.toLowerCase())
            
            const endStation = stations.find( s=>{
               return s.city.toLowerCase() === end.toLowerCase();
            })

            if(!startStation || !endStation){
                throw new Error('cities not found check')
            }
 

            const totalDistance = getDistance(startStation.lat , startStation.lng, endStation.lat, endStation.lng)
            const corridorWidth = 150 //either side of route 

            //NOW FIND THE STATIONS WHICH ARE IN THE ROUTE :- NOT TOO FAR;
            const routeStations = stations.filter( s=>{
                const distFromStart = getDistance(startStation.lat , startStation.lng, s.lat, s.lng);
                const distFromEnd = getDistance(s.lat, s.lng, endStation.lat, endStation.lng );
                //Station is on the route agar us station ka distance(from start and end) total distance + corridorWitdh se kam ho; 
                return((distFromStart + distFromEnd )<= (totalDistance + corridorWidth));
            })
            const stationsWithPrice = routeStations.map(station=>{
                const priceData = prices.find(
                    p=> parseInt(p.station_id) === station.station_id
                )
                return{
                    ...station,
                    petrol_price: priceData ? parseFloat(priceData.petrol_price) : null
                };
            })

            const sorted = stationsWithPrice.sort((a, b)=>{
                const distA = getDistance(startStation.lat, startStation.lng, a.lat, a.lng);
                const distB = getDistance(startStation.lat, startStation.lng, b.lat, b.lng);
                return distA - distB;
            })

            //const TANK_RANGE = 250; // fuel tank ka capacity asumption
            const TANK_RANGE = 400;
            const fuelStops = [];
            let lastStopLat = startStation.lat;
            let lastStopLng = startStation.lng;
            let remainingStations = [...sorted];

            while(remainingStations.length > 0){
                const distToEnd = getDistance(
                    lastStopLat, lastStopLng,
                    endStation.lat, endStation.lng
                );

                const reachable = remainingStations.filter(station => {
                    const distFromLast = getDistance(
                        lastStopLat, lastStopLng,
                        station.lat, station.lng
                    );
                    const stationDistToEnd = getDistance(
                        station.lat, station.lng,
                        endStation.lat, endStation.lng
                    );
                    // ✅ station must be within tank range
                    // ✅ AND must be closer to end than current position
                    return distFromLast <= TANK_RANGE && stationDistToEnd < distToEnd;
                });

                if(reachable.length === 0) break;

                const cheapest = reachable.reduce((best, station) => {
                    return station.petrol_price < best.petrol_price ? station : best;
                });

                fuelStops.push(cheapest);
                lastStopLat = cheapest.lat;
                lastStopLng = cheapest.lng;

                const cheapestIndex = remainingStations.indexOf(cheapest);
                remainingStations = remainingStations.slice(cheapestIndex + 1);
            }
            // console.log(stationsWithPrice);
            // console.log("Your optimal stops: ",fuelStops);
            // console.log(endStation);

//----------------------------------------------------------------------------------------------------------------------------------------------
//           Summary--->Calculation Total distance, Total Estimated fuel consumption, path to follow
//----------------------------------------------------------------------------------------------------------------------------------------------
           const MILEAGE = 15; // km per litre
            const ROAD_FACTOR = 1.3; // roads are ~30% longer than straight line

            const allPoints = [
                { lat: startStation.lat, lng: startStation.lng, petrol_price: fuelStops[0]?.petrol_price || 100 },
                ...fuelStops,
                { lat: endStation.lat, lng: endStation.lng, petrol_price: fuelStops[fuelStops.length-1]?.petrol_price || 100 }
            ];

            let totalCost = 0;
            for(let i = 0; i < allPoints.length - 1; i++){
                const segmentDist = getDistance(
                    allPoints[i].lat, allPoints[i].lng,
                    allPoints[i+1].lat, allPoints[i+1].lng
                ) * ROAD_FACTOR;
                const litres = segmentDist / MILEAGE;
                totalCost += litres * allPoints[i].petrol_price;
            }
            console.log("Total route stations found:", routeStations.length);
            console.log("Sorted stations:", sorted.map(s => s.city));
            console.log("Tank range:", TANK_RANGE);
            return {
                start,
                end,
                totalDistanceKm: Math.round(totalDistance * ROAD_FACTOR),
                fuelStops: fuelStops.map(s => ({
                    city: s.city,
                    station: s.station_name,
                    petrol_price: `₹${s.petrol_price}`,
                    lat: s.lat,
                    lng: s.lng
                })),
                estimatedTotalCost: `₹${totalCost.toFixed(2)}`,
                startCoords: { lat: startStation.lat, lng: startStation.lng },
                endCoords: { lat: endStation.lat, lng: endStation.lng }
            };
}