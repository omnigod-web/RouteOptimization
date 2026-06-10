import { motion } from 'framer-motion'
import { MdWarning, MdLightbulb, MdSchedule, MdLocalHotel, MdShield } from 'react-icons/md'

const getScoreColor = (score) => {
  if(score >= 75) return { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500', border: 'border-green-100' }
  if(score >= 50) return { bg: 'bg-yellow-50', text: 'text-yellow-600', bar: 'bg-yellow-500', border: 'border-yellow-100' }
  return { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', border: 'border-red-100' }
}

const getVerdictEmoji = (verdict) => {
  if(verdict === 'Safe') return '✅'
  if(verdict === 'Moderate Risk') return '⚠️'
  return '🚨'
}

const SafetyAdvisory = ({ safety }) => {
  if(!safety) return null

  const colors = getScoreColor(safety.safetyScore)

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-slate-800 p-2 rounded-xl">
          <MdShield className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">AI Safety Advisory</h2>
          <p className="text-slate-500 text-sm">Powered by Gemini AI — India highway safety analysis</p>
        </div>
      </div>

      {/* Score + Verdict */}
      <div className={`${colors.bg} border ${colors.border} rounded-3xl p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Safety Score</p>
            <div className="flex items-center gap-3">
              <span className={`text-5xl font-black ${colors.text}`}>{safety.safetyScore}</span>
              <span className="text-slate-400 text-2xl font-light">/100</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-sm font-medium mb-1">Verdict</p>
            <div className={`flex items-center gap-2 ${colors.text} font-black text-xl`}>
              <span>{getVerdictEmoji(safety.verdict)}</span>
              <span>{safety.verdict}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safety.safetyScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${colors.bar} rounded-full`}
          />
        </div>
      </div>

      {/* Warnings + Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Warnings */}
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdWarning className="text-red-500 text-xl" />
            <h3 className="font-black text-slate-800">Warnings</h3>
          </div>
          <div className="flex flex-col gap-3">
            {safety.warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                <p className="text-slate-600 text-sm leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdLightbulb className="text-green-500 text-xl" />
            <h3 className="font-black text-slate-800">Recommendations</h3>
          </div>
          <div className="flex flex-col gap-3">
            {safety.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
                <p className="text-slate-600 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Best Departure + Rest Stops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-2xl shrink-0">
            <MdSchedule className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Best Departure Time</p>
            <p className="font-black text-slate-800 text-lg">{safety.bestDepartureTime}</p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6 flex items-center gap-4">
          <div className="bg-purple-500 p-3 rounded-2xl shrink-0">
            <MdLocalHotel className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Recommended Rest Stops</p>
            <p className="font-black text-slate-800 text-lg">{safety.estimatedRestStops} stops recommended</p>
          </div>
        </div>
      </div>

    </motion.section>
  )
}

export default SafetyAdvisory