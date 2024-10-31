import { expect, jest } from '@jest/globals'
import db from '../../app/data/index.js'

jest.setTimeout(30000)

beforeEach(async () => {
  try {
    await db.sequelize.truncate({ cascade: true })
    await db.initial.create({ message: 'Hello, World!' })
  } catch (error) {
    console.log(error)
  }
})

afterEach(async () => {
  await db.sequelize.close()
})

describe('Database Config Tests', () => {
  test('should return data from the database', async () => {
    const result = await db.initial.findAll()
    const plainResult = result.map(record => record.get({ plain: true }))
    expect(plainResult).toEqual([{ id: 1, message: 'Hello, World!' }])
  })
})
