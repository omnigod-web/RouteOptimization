import { useState } from 'react'
import { MdLocationOn, MdFlag, MdDirectionsCar } from 'react-icons/md'
import { motion } from 'framer-motion'

const vehicles = [
  { type: 'bike', label: 'Bike', emoji: '🏍️' },
  { type: 'car', label: 'Car', emoji: '🚗' },
  { type: 'suv', label: 'SUV', emoji: '🚙' },
  { type: 'truck', label: 'Truck', emoji: '🚛' },
]

const HeroSection = ({ onSearch, loading }) => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [vehicleType, setVehicleType] = useState('car') // ← default car

  const handleSubmit = () => {
    if (!start || !end) return
    onSearch(start, end, vehicleType) // ← pass vehicleType
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center px-6 pt-20">
      <div className="max-w-3xl w-full text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🇮🇳 Built for Indian Highways
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-4">
          Find the <span className="text-orange-500">Cheapest</span> Fuel
          <br /> Route Across India
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg mb-10">
          Smart fuel stop planning that saves you money on every long drive 🚗
        </motion.p>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-orange-100">

          {/* Vehicle Selector */}
          <div className="mb-6">
            <p className="text-slate-500 text-sm font-medium mb-3 text-left">Select Vehicle Type</p>
            <div className="grid grid-cols-4 gap-3">
              {vehicles.map(v => (
                <button
                  key={v.type}
                  onClick={() => setVehicleType(v.type)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${
                    vehicleType === v.type
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-orange-200'
                  }`}>
                  <span className="text-2xl">{v.emoji}</span>
                  <span className="text-xs font-bold">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City Inputs */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            {/* Start Input */}
            <div className="flex-1 relative">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 text-xl" />
              <input
                type="text"
                placeholder="Start city (e.g. Mumbai)"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-400 focus:outline-none text-slate-700 font-medium transition-colors"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:flex items-center text-slate-300 text-2xl font-light">→</div>

            {/* End Input */}
            <div className="flex-1 relative">
              <MdFlag className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-xl" />
              <input
                type="text"
                placeholder="End city (e.g. Delhi)"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-400 focus:outline-none text-slate-700 font-medium transition-colors"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors text-lg">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Planning your route...
              </>
            ) : (
              <>
                <MdDirectionsCar className="text-2xl" />
                Optimize My Route
              </>
            )}
          </button>

        </motion.div>

      </div>
    </section>
  )
}

export default HeroSection