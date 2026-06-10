export const vehicleProfiles = {
    bike: {
        label: 'Motorcycle/Bike',
        mileage: 45,        // kmpl
        tankCapacity: 12,   // litres
        tankRange: 540,     // km (mileage × tankCapacity)
    },
    car: {
        label: 'Car/Sedan',
        mileage: 15,
        tankCapacity: 45,
        tankRange: 400,     // conservative (not full tank)
    },
    suv: {
        label: 'SUV/MUV',
        mileage: 12,
        tankCapacity: 60,
        tankRange: 500,
    },
    truck: {
        label: 'Truck/HCV',
        mileage: 8,
        tankCapacity: 200,
        tankRange: 800,
    }
}

export const defaultVehicle = 'car'