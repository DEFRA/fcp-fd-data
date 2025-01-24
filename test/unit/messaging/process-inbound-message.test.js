import { jest } from '@jest/globals'
import { COMMS_EVENT, FILE_METADATA } from '../../../app/constants/message-types.js'

jest.unstable_mockModule('../../../app/messaging/messages/process-comms-message.js', () => ({
  default: jest.fn()
}))
jest.unstable_mockModule('../../../app/messaging/messages/process-file-metadata.js', () => ({
  default: jest.fn()
}))

const processCommsMessage = (await import('../../../app/messaging/messages/process-comms-message.js')).default
const processFileMetadata = (await import('../../../app/messaging/messages/process-file-metadata.js')).default
const processInboundMessage = (await import('../../../app/messaging/process-inbound-message.js')).default

describe('processInboundMessage', () => {
  let mockReceiver

  beforeEach(() => {
    mockReceiver = {
      deadLetterMessage: jest.fn(),
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }
    jest.clearAllMocks()
  })

  test('should process commsMessage correctly', async () => {
    const message = {
      body: {
        [COMMS_EVENT]: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processCommsMessage).toHaveBeenCalledWith(message, mockReceiver)
    expect(processFileMetadata).not.toHaveBeenCalled()
    expect(mockReceiver.deadLetterMessage).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('should process fileMetadata correctly', async () => {
    const message = {
      body: {
        [FILE_METADATA]: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processFileMetadata).toHaveBeenCalledWith(message, mockReceiver)
    expect(processCommsMessage).not.toHaveBeenCalled()
    expect(mockReceiver.deadLetterMessage).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('should dead-letter message for invalid message type', async () => {
    const message = {
      body: {
        invalidType: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processCommsMessage).not.toHaveBeenCalled()
    expect(processFileMetadata).not.toHaveBeenCalled()
    expect(mockReceiver.deadLetterMessage).toHaveBeenCalledWith(message)
    expect(mockReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('should abandon message on error', async () => {
    const message = {
      body: {
        [COMMS_EVENT]: {}
      }
    }

    processCommsMessage.mockImplementation(() => {
      throw new Error('Test error')
    })

    await processInboundMessage(message, mockReceiver)

    expect(processCommsMessage).toHaveBeenCalledWith(message, mockReceiver)
    expect(processFileMetadata).not.toHaveBeenCalled()
    expect(mockReceiver.deadLetterMessage).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).toHaveBeenCalledWith(message)
  })
})
