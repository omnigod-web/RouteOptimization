import dotenv from 'dotenv'
dotenv.config()

const getRequiredPositiveNumber = (name, defaultValue) => {
    const rawValue = process.env[name]

    if(rawValue === undefined || rawValue === ''){
        if(defaultValue !== undefined){
            console.warn(`⚠️ ${name} not set, using default: ${defaultValue}`)
            return defaultValue
        }
        throw new Error(`${name} is missing. Add it to .env`)
    }

    const value = Number(rawValue)
    if(!Number.isFinite(value) || value <= 0){
        throw new Error(`${name} must be a positive number`)
    }

    return value
}

export const routeConfig = {
    tankRange: getRequiredPositiveNumber('TANK_RANGE', 400),
    mileage: getRequiredPositiveNumber('MILEAGE', 15),
    roadFactor: getRequiredPositiveNumber('ROAD_FACTOR', 1.3),
    corridorWidth: getRequiredPositiveNumber('CORRIDOR_WIDTH', 100),
    averageSpeed: getRequiredPositiveNumber('AVERAGE_SPEED', 60) // ← add this
}