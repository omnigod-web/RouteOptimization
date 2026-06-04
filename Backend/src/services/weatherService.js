import axios from 'axios'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// get weather for a single city
const getCityWeather = async (city) => {
    try {
        const response = await axios.get(WEATHER_BASE_URL, {
            params: {
                q: `${city},IN`,       // IN = India
                appid: WEATHER_API_KEY,
                units: 'metric'        // celsius
            }
        })

        const data = response.data
        return {
            city,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon
        }
    } catch(err) {
        // if weather fails for a city don't break everything
        console.warn(`⚠️ Weather unavailable for ${city}:`, err.message)
        return {
            city,
            temperature: null,
            condition: 'Unavailable',
            description: 'Weather data unavailable'
        }
    }
}

// get weather for ALL cities in parallel
export const getWeatherForCities = async (cities) => {
    const weatherPromises = cities.map(city => getCityWeather(city))
    const results = await Promise.all(weatherPromises)
    return results
}