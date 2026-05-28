import { motion } from 'framer-motion'
import { MdLocalGasStation } from 'react-icons/md'

const prices = [
  { city: 'Mumbai', price: '₹106.31' },
  { city: 'Delhi', price: '₹94.72' },
  { city: 'Bangalore', price: '₹101.94' },
  { city: 'Chennai', price: '₹102.63' },
  { city: 'Hyderabad', price: '₹109.66' },
  { city: 'Pune', price: '₹104.50' },
  { city: 'Kolkata', price: '₹106.03' },
  { city: 'Jaipur', price: '₹104.88' },
  { city: 'Lucknow', price: '₹94.65' },
  { city: 'Ahmedabad', price: '₹93.72' },
  { city: 'Kochi', price: '₹107.67' },
  { city: 'Kozhikode', price: '₹107.45' },
  { city: 'Nagpur', price: '₹106.74' },
  { city: 'Bhopal', price: '₹108.65' },
  { city: 'Patna', price: '₹107.24' },
]

// duplicate for seamless loop
const tickerItems = [...prices, ...prices]

const FuelTicker = () => {
  return (
    <div className="bg-slate-800 text-white py-3 overflow-hidden relative">

      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-800 to-transparent z-10" />

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-800 to-transparent z-10" />

      {/* Label */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        <MdLocalGasStation />
        LIVE
      </div>

      {/* Scrolling content */}
      <motion.div
        className="flex gap-8 pl-32"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}>
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <MdLocalGasStation className="text-orange-400 text-sm" />
            <span className="text-slate-300 text-sm font-medium">{item.city}</span>
            <span className="text-orange-400 text-sm font-bold">{item.price}</span>
            <span className="text-slate-600 mx-2">•</span>
          </div>
        ))}
      </motion.div>

    </div>
  )
}

export default FuelTicker