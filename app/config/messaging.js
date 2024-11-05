import Joi from 'joi'
import { PRODUCTION } from '../constants/environments.js'

const schema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  commsSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().allow('subscription'),
    numberOfReceivers: Joi.number().default(1)
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? import('applicationinsights') : undefined
  },
  commsSubscription: {
    address: process.env.COMMS_SUBSCRIPTION_ADDRESS,
    topic: process.env.COMMS_TOPIC_ADDRESS,
    type: 'subscription',
    numberOfReceivers: process.env.COMMS_SUBSCRIPTION_RECEIVERS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The messaging config is invalid. ${result.error.message}`)
}

const commsSubscription = { ...result.value.messageQueue, ...result.value.commsSubscription }
export default { commsSubscription }
