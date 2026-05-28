import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom petrol pump icon
const pumpIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#E8572A;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    width:36px;height:36px;
    display:flex;align-items:center;
    justify-content:center;
    border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <span style="transform:rotate(45deg);font-size:16px">⛽</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

// Start/End icon
const cityIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    background:${color};
    border-radius:50%;
    width:16px;height:16px;
    border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3)">
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const MapView = ({ result, startCoords, endCoords }) => {
  if (!result) return (
    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-3xl">
      <div className="text-center text-slate-400">
        <div className="text-6xl mb-4">🗺️</div>
        <p className="font-medium">Your route will appear here</p>
      </div>
    </div>
  )

  // build polyline points: start → stops → end
  const routePoints = [
    [startCoords.lat, startCoords.lng],
    ...result.fuelStops.map(s => [s.lat, s.lng]),
    [endCoords.lat, endCoords.lng],
  ]

  const center = routePoints[Math.floor(routePoints.length / 2)]

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full rounded-3xl z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* Route line */}
      <Polyline
        positions={routePoints}
        pathOptions={{ color: '#E8572A', weight: 4, dashArray: '8 4' }}
      />

      {/* Start marker */}
      <Marker position={[startCoords.lat, startCoords.lng]} icon={cityIcon('#22c55e')}>
        <Popup>🚗 Start: {result.start}</Popup>
      </Marker>

      {/* End marker */}
      <Marker position={[endCoords.lat, endCoords.lng]} icon={cityIcon('#1B3A4B')}>
        <Popup>🏁 End: {result.end}</Popup>
      </Marker>

      {/* Fuel stop markers */}
      {result.fuelStops.map((stop, i) => (
        <Marker key={i} position={[stop.lat, stop.lng]} icon={pumpIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{stop.city}</p>
              <p>{stop.station}</p>
              <p className="text-orange-500 font-bold">{stop.petrol_price}/L</p>
            </div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  )
}

export default MapView