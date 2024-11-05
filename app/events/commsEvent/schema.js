import Joi from 'joi'

const commsEventValidation = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
    'string.base': 'id should be a type of string',
    'string.guid': 'id should be a valid UUID',
    'any.required': 'The field id is not present but it is required'
  }),
  dateCreated: Joi.date().required().messages({
    'date.base': 'dateCreated should be a type of date',
    'any.required': 'The field dateCreated is not present but it is required'
  }),
  commsMessage: Joi.object().required().messages({
    'object.base': 'commsMessage should be a type of object',
    'any.required': 'The field commsMessage is not present but it is required'
  })
})

export default commsEventValidation
