import Joi from 'joi'

export const routeSchema = Joi.object({
    start: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'start location is required',
            'any.required': 'start location is required'
        }),
    end: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'end location is required',
            'any.required': 'end location is required'
        }),
    vehicleType: Joi.string()
        .valid('bike', 'car', 'suv', 'truck')
        .default('car')  // ← optional, defaults to car
        .messages({
            'any.only': 'vehicleType must be one of: bike, car, suv, truck'
        })
}).custom((value, helpers) => {
    if(value.start?.toLowerCase() === value.end?.toLowerCase()){
        return helpers.error('any.invalid')
    }
    return value
}).messages({
    'any.invalid': 'start and end locations must be different'
})