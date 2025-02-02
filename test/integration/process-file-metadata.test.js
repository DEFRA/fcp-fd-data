import processFileMetadata from '../../app/messaging/messages/process-file-metadata.js'
import db from '../../app/data/index'
import { jest } from '@jest/globals'
import { MESSAGE_CONTENT, VALID_MESSAGE } from '../mocks/file-metadata/valid.js'
import schema from '../../app/messaging/schemas/file-metadata/schema.js'

jest.mock('@azure/service-bus', () => {
  return {
    ServiceBusClient: jest.fn().mockImplementation(() => {
      return {
        createReceiver: jest.fn().mockReturnValue({
          deadLetterMessage: jest.fn(),
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
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should process a valid message', async () => {
    await processFileMetadata(VALID_MESSAGE, receiver)
    const savedMessage = await db.fileMetadata.findByPk(VALID_MESSAGE.body.id)
    expect(savedMessage).not.toBeNull()
    expect(savedMessage.dataValues.metadata).toStrictEqual(MESSAGE_CONTENT)
    expect(receiver.completeMessage).toHaveBeenCalledWith(VALID_MESSAGE)
  })
  test('should not complete message when internal error occurs', async () => {
    const internalError = new Error('Database error')
    jest.spyOn(db.fileMetadata, 'create').mockImplementation(() => {
      throw internalError
    })
    await processFileMetadata(VALID_MESSAGE, receiver)
    expect(console.error).toHaveBeenCalledWith('Unable to process request:', internalError)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should dead letter message when validation error occurs', async () => {
    const validationError = new Error('Validation error')
    validationError.details = 'Invalid message format'
    jest.spyOn(schema, 'validate').mockImplementation(() => {
      return { error: validationError }
    })

    await processFileMetadata(VALID_MESSAGE, receiver)

    expect(console.error).toHaveBeenCalledWith('Validation error:', validationError.details)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(VALID_MESSAGE)
  })
})
