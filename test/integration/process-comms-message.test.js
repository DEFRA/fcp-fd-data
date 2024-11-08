import processCommsMessage from '../../app/messaging/comms-message/process-comms-message'
import db from '../../app/data/index'
import { jest } from '@jest/globals'
import VALID_MESSAGE from '../mocks/valid-comms-message'
import INVALID_MESSAGE from '../mocks/invalid-comms-message'

jest.mock('@azure/service-bus', () => {
  return {
    ServiceBusClient: jest.fn().mockImplementation(() => {
      return {
        createReceiver: jest.fn().mockReturnValue({
          abandonMessage: jest.fn(),
          completeMessage: jest.fn()
        })
      }
    })
  }
})

describe('processCommsMessage', () => {
  let serviceBusClientInstance
  let receiver

  beforeEach(async () => {
    serviceBusClientInstance = new (await import('@azure/service-bus')).ServiceBusClient()
    receiver = serviceBusClientInstance.createReceiver()
    await db.sequelize.truncate({ cascade: true })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should process a valid message', async () => {
    await processCommsMessage(VALID_MESSAGE, receiver)
    const savedMessage = await db.commsEvent.findByPk(VALID_MESSAGE.body.id)
    expect(savedMessage).not.toBeNull()
    expect(savedMessage.dataValues.commsMessage.message).toBe('Hello, World!')
    expect(receiver.completeMessage).toHaveBeenCalledWith(VALID_MESSAGE)
  })

  test('should not process an invalid message', async () => {
    await processCommsMessage(INVALID_MESSAGE, receiver)
    const savedMessage = await db.commsEvent.findByPk(INVALID_MESSAGE.body.id)
    expect(savedMessage).toBeNull()
    expect(receiver.abandonMessage).toHaveBeenCalledWith(INVALID_MESSAGE)
  })

  test('should throw abandon message when internal error occurs ', async () => {
    jest.spyOn(db.commsEvent, 'create').mockImplementation(() => {
      throw new Error('Database error')
    })
    await processCommsMessage(VALID_MESSAGE, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(VALID_MESSAGE)
  })
})
