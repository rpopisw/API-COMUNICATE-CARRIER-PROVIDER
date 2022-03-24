const Joi = require('joi')
const CustomException = require('./supports/custom.exception')
const ErrorContants = require('./supports/error.constants')

const validateRequestCreateLabelShipping = async (request) => {
    try {
        const address_from = Joi.object({
            name: Joi.string().required(),
            street1: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().required(),
            postal_code: Joi.string().required(),
            country_code: Joi.string().required(),
        })
        const address_to = Joi.object({
            name: Joi.string().required(),
            street1: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().required(),
            postal_code: Joi.string().required(),
            country_code: Joi.string().required(),
        })
        const parcels = Joi.array().items(
            Joi.object({
                length: Joi.number().required(),
                width: Joi.number().required(),
                height: Joi.number().required(),
                dimensions_unit: Joi.string().required(),
                weight: Joi.number().required(),
                weight_unit: Joi.string().required()
            })
        ).required()
        const schema = Joi.object().keys({
            payload: Joi.object().keys({
                data: Joi.array().items(
                    Joi.object({
                        carrier: Joi.string().required(),
                        shipment: Joi.object({
                            address_from,
                            address_to,
                            parcels
                        }).required()
                    })
                ).required()
            }).required(),
        }).required()
        const response = await schema.validateAsync(request.body, { abortEarly: false })
        return response.error
    } catch (error) {
        return new CustomException(
            ErrorContants.requestInvalid.code,
            ErrorContants.requestInvalid.message,
            error.details,
            ErrorContants.requestInvalid.httpStatus,
        )
    }
}

module.exports = {
    validateRequestCreateLabelShipping
}