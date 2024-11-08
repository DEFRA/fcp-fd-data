import { PRODUCTION, DEVELOPMENT } from '../../../app/constants/environments.js'
import { jest } from '@jest/globals'

jest.mock('applicationinsights', () => ({
  setup: jest.fn(),
  start: jest.fn()
}))

describe('messaging config', () => {
  afterEach(() => {
    jest.resetModules()
  })

  test('should import applicationinsights in production', async () => {
    process.env.NODE_ENV = PRODUCTION
    const { default: config } = await import('../../../app/config/messaging.js')
    expect(config.commsSubscription.appInsights).toBeDefined()
  })

  test('should not import applicationinsights in non-production', async () => {
    process.env.NODE_ENV = DEVELOPMENT
    const { default: config } = await import('../../../app/config/messaging.js')
    expect(config.commsSubscription.appInsights).toBeUndefined()
  })

  test('should throw an error for invalid config', async () => {
    process.env.MESSAGE_QUEUE_HOST = ''
    await expect(import('../../../app/config/messaging.js')).rejects.toThrow('The messaging config is invalid.')
  })
})
