import { beforeEach, jest } from '@jest/globals'
// import { COMMS_EVENT, FILE_METADATA } from '../../app/constants/message-types'
import processInboundMessage from '../../app/messaging/process-inbound-message'
import db from '../../app/data/index'
import { commsMessage } from '../mocks/comms-message'

const mockReceiver = {
  abandonMessage: jest.fn(),
  completeMessage: jest.fn()
}

const validCommsMessage = {
  body: {
    id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
    commsMessage
  }
}

const invalidMessage = {
  body: {
    id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
    invalidMessageType: commsMessage
  }
}

beforeEach(async () => {
  await db.sequelize.truncate({ cascade: true })
})
describe('inbound message tests', () => {
  test('Should abandon message when not a valid message type', async () => {
    await processInboundMessage(invalidMessage, mockReceiver)
    expect(mockReceiver.abandonMessage).toHaveBeenCalled()
  })

  test('Should abandon message when message is empty', async () => {
    await processInboundMessage({}, mockReceiver)
    expect(mockReceiver.abandonMessage).toHaveBeenCalled()
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
})
