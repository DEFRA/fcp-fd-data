import db from '../../app/data/index.js'
import { jest } from '@jest/globals'

jest.mock('@azure/identity', () => {
  return {
    DefaultAzureCredential: jest.fn().mockImplementation(() => {
      return {
        getToken: jest.fn().mockResolvedValue({ token: 'mocked-access-token' })
      }
    })
  }
})

beforeEach(async () => {
  await db.sequelize.truncate({ cascade: true })
  await db.initial.create({ message: 'Hello, World!' })
})

afterAll(async () => {
  await db.sequelize.close()
})

describe('Database connection', () => {
  test('should return data from the database', async () => {
    const result = await db.initial.findAll()
    expect(result).toHaveLength(1)
  })
})
