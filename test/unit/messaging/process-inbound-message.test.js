import { jest } from '@jest/globals'
import { COMMS_EVENT, FILE_METADATA } from '../../../app/constants/message-types'

jest.unstable_mockModule('../../../app/messaging/messages/process-comms-message.js', () => ({
  default: jest.fn()
}))
jest.unstable_mockModule('../../../app/messaging/messages/process-file-metadata', () => ({
  default: jest.fn()
}))

const processFileMetadata = (await import('../../../app/messaging/messages/process-file-metadata')).default
const processCommsMessage = (await import('../../../app/messaging/messages/process-comms-message')).default
const processInboundMessage = (await import('../../../app/messaging/process-inbound-message')).default

describe('processInboundMessage', () => {
  let mockReceiver

  beforeEach(() => {
    mockReceiver = {
      abandonMessage: jest.fn(),
      completeMessage: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should process commsMessage correctly', async () => {
    const message = {
      body: {
        id: 'a058de5b-42ad-473c-91e7-0797a43fda33',
        [COMMS_EVENT]: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processCommsMessage).toHaveBeenCalledWith(message, mockReceiver)
    expect(processFileMetadata).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('should process fileMetadata correctly', async () => {
    const message = {
      body: {
        id: 'a058de5b-42ad-473c-91e7-0797a43fda33',
        [FILE_METADATA]: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processFileMetadata).toHaveBeenCalledWith(message, mockReceiver)
    expect(processCommsMessage).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('should abandon message for invalid message type', async () => {
    const message = {
      body: {
        id: 'a058de5b-42ad-473c-91e7-0797a43fda33',
        invalidType: {}
      }
    }

    await processInboundMessage(message, mockReceiver)

    expect(processCommsMessage).not.toHaveBeenCalled()
    expect(processFileMetadata).not.toHaveBeenCalled()
    expect(mockReceiver.abandonMessage).toHaveBeenCalledWith(message)
  })
})
