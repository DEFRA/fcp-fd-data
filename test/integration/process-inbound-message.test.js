import { beforeEach, jest } from '@jest/globals'
// import { COMMS_EVENT, FILE_METADATA } from '../../app/constants/message-types'
import processInboundMessage from '../../app/messaging/process-inbound-message'
import db from '../../app/data/index'
import { commsMessage } from '../mocks/comms-message/comms-message.js'
import validFileMetadata from '../mocks/file-metadata/valid.js'

const id = 'a058de5b-42ad-473c-91e7-0797a43fda30'

const mockReceiver = {
  deadLetterMessage: jest.fn(),
  completeMessage: jest.fn(),
  abandonMessage: jest.fn()
}

const validCommsMessage = {
  body: {
    id,
    commsMessage
  }
}

const invalidMessage = {
  body: {
    id,
    invalidMessageType: commsMessage
  }
}

beforeEach(async () => {
  await db.sequelize.truncate({ cascade: true })
})
describe('inbound message tests', () => {
  test('Should abandon message when not a valid message type', async () => {
    await processInboundMessage(invalidMessage, mockReceiver)
    expect(mockReceiver.deadLetterMessage).toHaveBeenCalled()
  })

  test('Should abandon message when message is empty', async () => {
    await processInboundMessage({}, mockReceiver)
    expect(mockReceiver.deadLetterMessage).toHaveBeenCalled()
  })

  test('Should not create a commsEvent in commsEvent table when invalid message type used', async () => {
    await processInboundMessage(invalidMessage, mockReceiver)
    const savedMessage = await db.commsEvent.findByPk(invalidMessage.body.id)
    expect(savedMessage).toBeNull()
  })

  test('Should create a commsEvent in commsEvent table when type is COMMS_EVENT', async () => {
    await processInboundMessage(validCommsMessage, mockReceiver)
    const savedMessage = await db.commsEvent.findByPk(validCommsMessage.body.id)
    expect(savedMessage.commsMessage).toStrictEqual(validCommsMessage.body.commsMessage)
    expect(savedMessage.id).toBe(validCommsMessage.body.id)
  })

  test('Should call completeMessage when a valid commsMessage', async () => {
    await processInboundMessage(validCommsMessage, mockReceiver)
    expect(mockReceiver.completeMessage).toHaveBeenCalled()
  })

  test('Should create a fileMetadata record in metadata table when type is FILE_METADATA', async () => {
    await processInboundMessage(validFileMetadata, mockReceiver)
    const savedMessage = await db.fileMetadata.findByPk(validFileMetadata.body.id)
    expect(savedMessage.metadata).toStrictEqual(validFileMetadata.body.metadata)
    expect(savedMessage.id).toBe(validFileMetadata.body.id)
  })
})
