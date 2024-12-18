import db from '../../app/data/index.js'

beforeEach(async () => {
  await db.sequelize.truncate({ cascade: true })
  await db.commsEvent.create({ id: '44925853-76f7-435f-adb9-158af77e9f01', dateCreated: new Date(), commsMessage: { message: 'Hello, world!' } })
})

afterAll(async () => {
  await db.sequelize.close()
})

describe('Database connection', () => {
  test('should return data from the database', async () => {
    const result = await db.commsEvent.findAll()
    expect(result).toHaveLength(1)
  })
})
