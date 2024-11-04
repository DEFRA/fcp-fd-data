import { expect } from '@jest/globals'
import db from '../../app/data/index.js'

beforeEach(async () => {
  await db.sequelize.truncate({ cascade: true })
  await db.initial.create({ message: 'Hello, World!' })
})

afterEach(async () => {
  await db.sequelize.close()
})

describe('Database Config Tests', () => {
  test('should return data from the database', async () => {
    const result = await db.initial.findAll()
    expect(result).toHaveLength(1)
  })
})
