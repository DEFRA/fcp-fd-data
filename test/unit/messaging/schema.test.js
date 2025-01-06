// import INVALID_MESSAGE from '../../mocks/comms-message/invalid-comms-message'
import VALID_MESSAGE from '../../mocks/comms-message/valid-comms-message.js'
import schema from '../../../app/messaging/schemas/comms-message.js'

const INVALID_MESSAGE = { body: { ...VALID_MESSAGE } }
INVALID_MESSAGE.body.id = 'invalid-id'

describe('Schema Validation', () => {
  test('should validate a correct object', () => {
    const { error } = schema.validate(VALID_MESSAGE.body)
    expect(error).toBeUndefined()
  })

  test('should return an error if id is not a string', () => {
    const invalidObject = {
      ...INVALID_MESSAGE,
      id: 12345
    }
    const { error } = schema.validate(invalidObject)
    expect(error.details[0].message).toBe('id should be a type of string')
  })

  test('should return an error if id is not a valid UUID', () => {
    const invalidObject = {
      ...INVALID_MESSAGE,
      id: 'invalid-uuid'
    }
    const { error } = schema.validate(invalidObject)
    expect(error.details[0].message).toBe('id should be a valid UUID')
  })

  test('should return an error if id is not present', () => {
    const { id, ...invalidObject } = INVALID_MESSAGE
    const { error } = schema.validate(invalidObject)
    expect(error.details[0].message).toBe('The field id is not present but it is required')
  })

  test('should return an error if commsMessage is not an object', () => {
    const invalidObject = {
      ...VALID_MESSAGE,
      commsMessage: 'not-an-object'
    }
    console.log('invalidObject', invalidObject)
    const { error } = schema.validate(invalidObject)
    expect(error.details[0].message).toBe('commsMessage should be a type of object')
  })

  test('should return an error if commsMessage is not present', () => {
    const { commsMessage, ...invalidObject } = VALID_MESSAGE
    const { error } = schema.validate(invalidObject)
    expect(error.details[0].message).toBe('The field commsMessage is not present but it is required')
  })
})
