// validators/routeValidator.js
import Joi from 'joi'

export const routeSchema = Joi.object({
    start: Joi.string()
        .trim()          // ← Joi trims it first!
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'start location is required',
            'any.required': 'start location is required'
        }),
    end: Joi.string()
        .trim()          // ← Joi trims it first!
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'end location is required',
            'any.required': 'end location is required'
        }),
}).custom((value, helpers) => {
    if(value.start?.toLowerCase() === value.end?.toLowerCase()){
        return helpers.error('any.invalid')
    }
    return value
}).messages({
    'any.invalid': 'start and end locations must be different'
})