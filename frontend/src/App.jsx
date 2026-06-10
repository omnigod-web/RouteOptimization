import { useRef, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FuelTicker from './components/FuelTicker'
import MapView from './components/MapView'
import ResultPanel from './components/ResultPanel'
import SafetyAdvisory from './components/SafetyAdvisory'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  const handleSearch = async (start, end, vehicleType) => {
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/route`, { start, end, vehicleType })
   
      setResult(res.data)
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } catch (err) {
      const apiMessage = err.response?.data?.message
      const apiError = err.response?.data?.error
      const networkMessage = err.request
        ? `Could not reach the backend API at ${API_URL}. Check VITE_API_URL in Vercel.`
        : 'Something went wrong'
      alert([apiMessage, apiError].filter(Boolean).join(': ') || networkMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (!result) return
    const text = `🚗 FuelRoute Plan\n📍 ${result.start} → ${result.end}\n📏 ${result.totalDistanceKm}km\n💰 ${result.estimatedTotalCost}\n⛽ Stops: ${result.fuelStops.map(s => s.city).join(' → ')}`
    navigator.clipboard.writeText(text)
    alert('Journey copied to clipboard! 📋')
  }

  return (
    <div className="bg-[#F8F4EF] min-h-screen">
      <Navbar />
      <HeroSection onSearch={handleSearch} loading={loading} />
      <FuelTicker />

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="bg-orange-100 text-orange-600 text-sm font-bold px-4 py-2 rounded-full">
            SIMPLE & SMART
          </span>
          <h2 className="text-4xl font-black text-slate-800 mt-4 mb-3">
            How It Works
          </h2>
          <p className="text-slate-500 text-lg">Plan your fuel stops in 3 easy steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-md border border-orange-100 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">1</div>
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Enter Your Route</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Type your start and destination city anywhere across India</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-md border border-orange-100 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">2</div>
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Smart Optimization</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our algorithm finds the cheapest fuel stations along your route within tank range</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-md border border-orange-100 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">3</div>
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Follow The Map</h3>
            <p className="text-slate-500 text-sm leading-relaxed">See your optimized route on the map with all fuel stops marked clearly</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
          {[
            { value: '200+', label: 'Fuel Stations' },
            { value: '28+', label: 'Indian States' },
            { value: '15kmpl', label: 'Avg Mileage' },
            { value: '100%', label: 'Free to Use' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
              <p className="text-3xl font-black text-orange-500">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map + Results Section */}
      <section ref={resultRef} className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-slate-800 text-center mb-10">
          Your Optimized Route 🗺️
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">

          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-orange-100 h-full">
            <MapView
              result={result}
              startCoords={result?.startCoords}
              endCoords={result?.endCoords}
            />
          </div>

          {/* Result Panel */}
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 h-full overflow-hidden">
            <ResultPanel result={result} onShare={handleShare} />
          </div>

        </div>
      </section>

      {/* Safety Advisory Section */}
      {result && (
        <SafetyAdvisory safety={result.safetyAdvisory} />
      )}

    </div>
  )
}

export default App