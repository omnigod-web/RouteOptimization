# 🚗 IntelligentGo — India's Smartest Fuel Route Optimizer

> A full-stack intelligent route planning application that finds the **cheapest fuel stops** across Indian highways, powered by real-time weather data and AI-driven safety advisories.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-FuelWise-orange)](https://intelligent-go.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://intelligentgo2.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🌟 Live Demo

- **Frontend:** [Frontend](https://intelligent-go.vercel.app)
- **Backend API:** [Backend-Server](https://intelligentgo2.onrender.com)

---

## ✨ Features

### Core
- 🗺️ **Fuel Stop Optimization** — Haversine-based greedy algorithm finds cheapest stations along route
- 🚗 **Multi-Vehicle Support** — Bike, Car, SUV, Truck with different mileage & tank ranges
- ⏱️ **Travel Time Estimation** — Realistic highway speed-based calculation
- 💰 **Cost Estimation** — Per-segment fuel cost using destination station prices

### Intelligence
- 🌦️ **Real-time Weather** — Live OpenWeatherMap data for every fuel stop (parallel API calls)
- 🤖 **AI Safety Advisory** — Gemini AI analyzes route + weather → safety score, warnings, recommendations
- 📍 **Interactive Map** — Leaflet.js with animated route line and custom ⛽ fuel pump markers

### Backend Engineering
- ⚡ **3-Layer Redis Caching** — Route (1hr), Weather (30min), Safety Advisory (1hr)
- 🔄 **Load Balancing** — Node.js Cluster module utilizing all CPU cores
- 🛡️ **Rate Limiting** — express-rate-limit with proxy trust for production
- ✅ **Input Validation** — Joi schema validation with custom cross-field checks
- 🔁 **Graceful Degradation** — Redis/AI failures don't break the API

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| Node.js Cluster | Multi-core load balancing |
| Redis (Upstash) | 3-layer caching system |
| Joi | Input validation |
| OpenWeatherMap API | Real-time weather data |
| Gemini AI API | Safety advisory generation |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting |

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Leaflet.js | Interactive maps |
| Axios | HTTP client |

### Deployment
| Service | Purpose |
|---|---|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Upstash | Managed Redis |

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────┐
                    │         React Frontend           │
                    │   (Vercel — global CDN)         │
                    └──────────────┬──────────────────┘
                                   │ HTTPS
                    ┌──────────────▼──────────────────┐
                    │      Express.js Backend          │
                    │      (Render — Node.js)          │
                    │                                  │
                    │  ┌─────────────────────────┐    │
                    │  │   Node.js Cluster        │    │
                    │  │  Worker 1 | Worker 2 ... │    │
                    │  └─────────────────────────┘    │
                    │                                  │
                    │  MVC Architecture:               │
                    │  Routes → Controllers →          │
                    │  Services → Data                 │
                    └──┬───────────┬──────────┬───────┘
                       │           │          │
             ┌─────────▼──┐  ┌────▼────┐  ┌─▼──────────┐
             │   Upstash   │  │ OpenWx  │  │  Gemini AI  │
             │   Redis     │  │   API   │  │     API     │
             │  (Cache)    │  │(Weather)│  │  (Safety)   │
             └────────────┘  └─────────┘  └────────────┘
```

---

## 📡 API Documentation

### `POST /api/route`

Plan an optimized fuel route between two Indian cities.

**Request Body:**
```json
{
    "start": "Mumbai",
    "end": "Delhi",
    "vehicleType": "car"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| start | string | ✅ | Any Indian city |
| end | string | ✅ | Any Indian city |
| vehicleType | string | ❌ | bike, car, suv, truck (default: car) |

**Response:**
```json
{
    "start": "mumbai",
    "end": "delhi",
    "vehicle": {
        "type": "car",
        "label": "Car/Sedan",
        "mileage": 15,
        "tankRange": 400
    },
    "totalDistanceKm": 1493,
    "estimatedTravelTime": {
        "hours": 24,
        "minutes": 53,
        "formatted": "24h 53m"
    },
    "fuelStops": [
        {
            "city": "Aurangabad",
            "station": "Bharat Petroleum",
            "petrol_price": "₹93.37",
            "lat": 19.8762,
            "lng": 75.3433,
            "weather": {
                "temperature": 27,
                "condition": "Clear",
                "description": "clear sky",
                "humidity": 62,
                "windSpeed": 6.13
            }
        }
    ],
    "estimatedTotalCost": "₹3735.54",
    "safetyAdvisory": {
        "safetyScore": 72,
        "verdict": "Moderate Risk",
        "warnings": ["..."],
        "recommendations": ["..."],
        "bestDepartureTime": "Early morning 5-6 AM",
        "estimatedRestStops": 3
    }
}
```

### `GET /health`
Returns API health status.

---

## ⚙️ Algorithm

### Fuel Stop Optimization
```
1. Haversine formula → straight-line distance between coordinates
2. Corridor filtering → stations within 150km of straight-line route
3. Greedy algorithm  → pick cheapest station within tank range
                        that makes progress toward destination
4. Road factor (1.3x) → realistic road distance from straight line
```

### Cost Calculation
```
For each segment (stop to stop):
  segment_distance = haversine(A, B) × road_factor
  litres_needed    = segment_distance / vehicle_mileage
  segment_cost     = litres_needed × destination_price
total_cost = Σ segment_costs
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- Upstash Redis account (free)
- OpenWeatherMap API key (free)
- Gemini AI API key (free tier)

### Backend
```bash
git https://github.com/SakshiTripathi-78/IntelligentGo
cd IntelligentGo/Backend
npm install
```

Create `.env`:
```bash
REDIS_TOKEN=your_upstash_token
PORT=3000
TANK_RANGE=400
MILEAGE=15
ROAD_FACTOR=1.3
CORRIDOR_WIDTH=150
AVERAGE_SPEED=60
WEATHER_API_KEY=your_openweathermap_key
GEMINI_API_KEY=your_gemini_key
```

```bash
npm run dev
```

### Frontend
```bash
cd IntelligentGo/frontend
npm install
```

Create `.env`:
```bash
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
IntelligentGo/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── redis.js          # Redis client setup
│   │   │   ├── routeConfig.js    # Environment-based config
│   │   │   └── vehicleConfig.js  # Vehicle profiles
│   │   ├── controllers/
│   │   │   └── routeController.js
│   │   ├── middlewares/
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   └── route.js
│   │   ├── services/
│   │   │   ├── routePlanner.js   # Core algorithm
│   │   │   ├── weatherService.js # Weather API + caching
│   │   │   └── safetyService.js  # AI safety advisory
│   │   ├── validators/
│   │   │   └── routeValidator.js
│   │   ├── app.js
│   │   └── cluster.js
│   ├── data/
│   │   ├── geocoded_stations.json
│   │   └── fuel_prices.csv
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FuelTicker.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   └── SafetyAdvisory.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🔮 Future Improvements

- [ ] Real road distance via Google Maps API
- [ ] User authentication + saved routes
- [ ] CNG/EV support
- [ ] Real-time fuel price updates
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Sakshi Ashok Tripathi**
- GitHub: [@Sakshi-Ashok-Tripathi](https://github.com/SakshiTripathi-78)
- LinkedIn: [#Sakshi-Ashok-Tripathi](https://www.linkedin.com/in/sakshi-ashok-tripathi-043a55325/)

---

*Built with ❤️ for Indian highway travelers*