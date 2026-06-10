import { motion } from 'framer-motion'
import { MdLocationOn, MdFlag, MdLocalGasStation, MdShare, MdRoute, MdAttachMoney, MdAccessTime } from 'react-icons/md'

const StopCard = ({ stop, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-4">
    <div className="bg-orange-500 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold shrink-0">
      {index + 1}
    </div>
    <div className="flex-1">
      <p className="font-bold text-slate-800">{stop.city}</p>
      <p className="text-sm text-slate-500">{stop.station}</p>
      {/* Weather row */}
      {stop.weather?.temperature && (
        <div className="flex items-center gap-2 mt-1">
          <img
            src={`https://openweathermap.org/img/wn/${stop.weather.icon}.png`}
            alt={stop.weather.condition}
            className="w-6 h-6"
          />
          <span className="text-xs text-slate-500">
            {stop.weather.temperature}°C · {stop.weather.description}
          </span>
        </div>
      )}
    </div>
    <div className="text-right">
      <p className="font-black text-orange-500 text-lg">{stop.petrol_price}</p>
      <p className="text-xs text-slate-400">per litre</p>
    </div>
  </motion.div>
)

const ResultPanel = ({ result, onShare }) => {

  // ✅ check result first before anything else
  if (!result) return (
    <div className="h-full flex items-center justify-center text-center text-slate-400 p-8">
      <div>
        <div className="text-6xl mb-4">⛽</div>
        <p className="font-medium text-lg">Enter start and end cities</p>
        <p className="text-sm mt-1">to see your optimized fuel route</p>
      </div>
    </div>
  )

  // ✅ safe to access result properties here
  const travelTime = result.estimatedTravelTime?.formatted || 'N/A'
  console.log(travelTime);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto p-6 flex flex-col gap-6">

      {/* Journey Summary */}
      <div>
        <h2 className="text-xl font-black text-slate-800 mb-4">Journey Summary</h2>

        {/* Route */}
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 mb-3">
          <MdLocationOn className="text-green-500 text-2xl shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium">FROM</p>
            <p className="font-bold text-slate-800 capitalize">{result.start}</p>
          </div>
          <div className="text-slate-300">→</div>
          <div className="flex-1 text-right">
            <p className="text-xs text-slate-400 font-medium">TO</p>
            <p className="font-bold text-slate-800 capitalize">{result.end}</p>
          </div>
          <MdFlag className="text-blue-500 text-2xl shrink-0" />
        </div>

        {/* Stats — 4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <MdRoute className="text-blue-500 text-2xl mx-auto mb-1" />
            <p className="text-2xl font-black text-slate-800">{result.totalDistanceKm}</p>
            <p className="text-xs text-slate-500">km total</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 text-center">
            <MdLocalGasStation className="text-orange-500 text-2xl mx-auto mb-1" />
            <p className="text-2xl font-black text-slate-800">{result.fuelStops.length}</p>
            <p className="text-xs text-slate-500">fuel stops</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <MdAttachMoney className="text-green-500 text-2xl mx-auto mb-1" />
            <p className="text-lg font-black text-slate-800">{result.estimatedTotalCost}</p>
            <p className="text-xs text-slate-500">est. cost</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 text-center">
            <MdAccessTime className="text-yellow-500 text-2xl mx-auto mb-1" />
            <p className="text-xl font-black text-slate-800">{result.estimatedTravelTime?.formatted || 'N/A'}</p>
            <p className="text-xs text-slate-500">travel time</p>
          </div>
        </div>
      </div>

      {/* Fuel Stops */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-3">
          📍 Recommended Fuel Stops
        </h3>
        <div className="flex flex-col gap-3">
          {result.fuelStops.map((stop, i) => (
            <StopCard key={i} stop={stop} index={i} />
          ))}
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="w-full flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-4 rounded-2xl transition-colors">
        <MdShare className="text-xl" />
        Share Journey
      </button>

    </motion.div>
  )
}

export default ResultPanel