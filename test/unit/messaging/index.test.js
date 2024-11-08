import { MessageReceiver } from 'ffc-messaging'
import commsService from '../../../app/messaging/comms-message/index.js'
import { jest } from '@jest/globals'

describe('commsService', () => {
  let mockMessageReceiver

  beforeEach(() => {
    mockMessageReceiver = {
      subscribe: jest.fn(),
      closeConnection: jest.fn()
    }
    jest.spyOn(MessageReceiver.prototype, 'subscribe').mockImplementation(mockMessageReceiver.subscribe)
    jest.spyOn(MessageReceiver.prototype, 'closeConnection').mockImplementation(mockMessageReceiver.closeConnection)
  })

  afterEach(async () => {
    await commsService.stop()
    jest.clearAllMocks()
  })

  test('start should initialize MessageReceiver and subscribe', async () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

    await commsService.start()

    expect(MessageReceiver.prototype.subscribe).toHaveBeenCalled()
    expect(consoleInfoSpy).toHaveBeenCalledWith('Service is ready to consume messages')

    consoleInfoSpy.mockRestore()
  })

  test('stop should close the MessageReceiver connection', async () => {
    await commsService.start()
    await commsService.stop()

    expect(MessageReceiver.prototype.closeConnection).toHaveBeenCalled()
  })
})
