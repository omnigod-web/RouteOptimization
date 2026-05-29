// validators/routeValidator.js
import Joi from 'joi'

export const routeSchema = Joi.object({
    start: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'start location is required',
            'string.min': 'start location is too short',
            'any.required': 'start location is required'
        }),
    end: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'end location is required',
            'string.min': 'end location is too short',
            'any.required': 'end location is required'
        }).custom((value, helpers) => {
    // ← custom cross-field validation
            if(value.start?.toLowerCase() === value.end?.toLowerCase()){
                return helpers.error('any.invalid')
            }
            return value
        }).messages({
            'any.invalid': 'start and end locations must be different'
        })
})