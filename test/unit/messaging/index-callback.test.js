import { jest } from '@jest/globals'

const mockProcessCommsMessage = jest.fn()
jest.unstable_mockModule('../../../app/messaging/comms-message/process-comms-message.js', () => ({
  default: mockProcessCommsMessage
}))
jest.mock('ffc-messaging', () => {
  const mockSubscribe = jest.fn()
  const mockCloseConnection = jest.fn()
  return {
    MessageReceiver: jest.fn(() => ({
      subscribe: mockSubscribe,
      closeConnection: mockCloseConnection
    }))
  }
})

describe('Start and Stop Messaging Service', () => {
  let MessageReceiver, module

  beforeAll(async () => {
    module = await import('../../../app/messaging/comms-message/index.js')
    MessageReceiver = (await import('ffc-messaging')).MessageReceiver
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should pass a callback to the MessageReceiver that calls processCommsMessage', async () => {
    await module.default.start()
    const mockMessage = { body: 'This is a test message' }
    const messageCallback = MessageReceiver.mock.calls[0][1]
    await messageCallback(mockMessage)

    expect(mockProcessCommsMessage).toHaveBeenCalledWith(
      mockMessage,
      expect.objectContaining({ subscribe: expect.any(Function) })
    )
  })
})
