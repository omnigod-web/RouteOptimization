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
                // find all stations reachable from current position
                const reachable = remainingStations.filter(station => {
                    const dist = getDistance(
                        lastStopLat, lastStopLng,
                        station.lat, station.lng
                    );
                    return dist <= TANK_RANGE;
                });

                // no reachable stations left
                if(reachable.length === 0) break;

                // pick the CHEAPEST among reachable ones
                const cheapest = reachable.reduce((best, station) => {
                    return station.petrol_price < best.petrol_price ? station : best;
                });

                fuelStops.push(cheapest);

                // update current position
                lastStopLat = cheapest.lat;
                lastStopLng = cheapest.lng;

                // remove all stations up to and including cheapest from remaining
                const cheapestIndex = remainingStations.indexOf(cheapest);
                remainingStations = remainingStations.slice(cheapestIndex + 1);
            }
            // console.log(stationsWithPrice);
            console.log("Your optimal stops: ",fuelStops);
            // console.log(endStation);
                        
            return{
                start,
                end,
                fuelStops:["Station A" , "Station B"],
                totalCost:120.50,
                routeStations
            }
}