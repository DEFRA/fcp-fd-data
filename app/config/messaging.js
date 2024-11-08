import convict from 'convict'
import { PRODUCTION } from '../constants/environments.js'

const messaging = convict({
  messageQueue: {
    host: {
      doc: 'Message queue host.',
      format: String,
      default: null,
      env: 'MESSAGE_QUEUE_HOST'
    },
    username: {
      doc: 'Message queue username.',
      format: String,
      default: null,
      nullable: true,
      env: 'MESSAGE_QUEUE_USER'
    },
    password: {
      doc: 'Message queue password.',
      format: String,
      default: null,
      nullable: true,
      env: 'MESSAGE_QUEUE_PASSWORD'
    },
    useCredentialChain: {
      doc: 'Use of credential chain for authentication.',
      format: Boolean,
      default: process.env.NODE_ENV === PRODUCTION
    },
    managedIdentityClientId: {
      doc: 'Client ID of the managed identity for the service.',
      format: String,
      default: null,
      nullable: true,
      env: 'AZURE_CLIENT_ID'
    },
    appInsights: {
      doc: 'App Insights client instance.',
      format: '*',
      default: process.env.NODE_ENV === PRODUCTION ? await import('applicationinsights') : undefined
    }
  },
  receiverSubscription: {
    address: {
      doc: 'Receiver subscription address (i.e. name of subscription).',
      format: String,
      default: null,
      env: 'COMMS_SUBSCRIPTION_ADDRESS'
    },
    topic: {
      doc: 'Receiver topic address (i.e. name of topic corresponding to the subscription).',
      format: String,
      default: null,
      env: 'COMMS_TOPIC_ADDRESS'
    },
    type: {
      doc: 'Type of subscription (value is "subscription" by default as it is a receiver).',
      format: String,
      default: 'subscription'
    }
  }
})

messaging.validate({ allowed: 'strict' })

export default messaging
