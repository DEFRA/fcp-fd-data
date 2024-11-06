import { PRODUCTION } from '../../../app/constants/environments.js'
import { jest } from '@jest/globals'

jest.mock('applicationinsights', () => ({
  setup: jest.fn(),
  start: jest.fn()
}))

describe('messaging config', () => {
  let originalEnv

  beforeEach(() => {
    // Save the original environment variables
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    // Restore the original environment variables
    process.env = originalEnv
    jest.resetModules()
  })

  test('should import applicationinsights in production', async () => {
    process.env.NODE_ENV = PRODUCTION
    process.env.MESSAGE_QUEUE_HOST = 'localhost'
    process.env.COMMS_SUBSCRIPTION_ADDRESS = 'address'
    process.env.COMMS_TOPIC_ADDRESS = 'topic'
    process.env.COMMS_SUBSCRIPTION_RECEIVERS = '1'

    const { default: config } = await import('../../../app/config/messaging.js')
    expect(config.commsSubscription.appInsights).toBeDefined()
  })

  test('should not import applicationinsights in non-production', async () => {
    process.env.NODE_ENV = 'development'
    process.env.MESSAGE_QUEUE_HOST = 'localhost'
    process.env.COMMS_SUBSCRIPTION_ADDRESS = 'address'
    process.env.COMMS_TOPIC_ADDRESS = 'topic'
    process.env.COMMS_SUBSCRIPTION_RECEIVERS = '1'

    const { default: config } = await import('../../../app/config/messaging.js')
    expect(config.commsSubscription.appInsights).toBeUndefined()
  })

  test('should throw an error for invalid config', async () => {
    process.env.MESSAGE_QUEUE_HOST = ''
    process.env.COMMS_SUBSCRIPTION_ADDRESS = ''
    process.env.COMMS_TOPIC_ADDRESS = ''
    process.env.COMMS_SUBSCRIPTION_RECEIVERS = ''

    await expect(import('../../../app/config/messaging.js')).rejects.toThrow('The messaging config is invalid.')
  })
})
