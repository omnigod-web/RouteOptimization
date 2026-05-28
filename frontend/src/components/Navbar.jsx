import { MdLocalGasStation } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl">
            <MdLocalGasStation className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">FuelRoute</h1>
            <p className="text-xs text-orange-500 font-medium">India's Smartest Fuel Planner</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-slate-600 hover:text-orange-500 transition-colors text-sm font-medium">
            How it works
          </a>
          <a href="https://github.com/omnigod-web" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <FaGithub className="text-lg" />
            GitHub
          </a>
        </div>

      </div>
    </nav>
  )
}

export default Navbar