import db from '../../app/data/index.js'

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
