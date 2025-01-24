import { VALID_MESSAGE } from '../../mocks/file-metadata/valid.js'
import schema from '../../../app/messaging/schemas/file-metadata/schema.js'
const INVALID_MESSAGE = VALID_MESSAGE

describe('Schema Validation', () => {
  test('should validate a correct object', () => {
    const { error } = schema.validate(VALID_MESSAGE.body)
    expect(error).toBeUndefined()
  })

  test('should return an error if id is not a string', () => {
    INVALID_MESSAGE.body.id = 12345
    const { error } = schema.validate(INVALID_MESSAGE.body)
    expect(error.details[0].message).toBe('id should be a type of string')
  })

  test('should return an error if id is not a valid UUID', () => {
    INVALID_MESSAGE.body.id = '550e8400-e29b-41d4-a716-446655440000zzzz'
    const { error } = schema.validate(INVALID_MESSAGE.body)
    expect(error.details[0].message).toBe('id should be a valid UUID')
  })

  test('should return an error if id is not present', () => {
    delete INVALID_MESSAGE.body.id
    const { error } = schema.validate(INVALID_MESSAGE.body)
    expect(error.details[0].message).toBe('The field id is not present but it is required')
  })
  test('should return an error if commsMessage is not an object', () => {
    INVALID_MESSAGE.body.id = '550e8400-e29b-41d4-a716-446655440001'
    INVALID_MESSAGE.body.metadata = 'not-an-object'
    const { error } = schema.validate(INVALID_MESSAGE.body)
    expect(error.details[0].message).toBe('metadata should be a type of object')
  })

  test('should return an error if commsMessage is not present', () => {
    delete INVALID_MESSAGE.body.metadata
    const { error } = schema.validate(INVALID_MESSAGE.body)
    expect(error.details[0].message).toBe('The field metadata is not present but it is required')
  })
})
