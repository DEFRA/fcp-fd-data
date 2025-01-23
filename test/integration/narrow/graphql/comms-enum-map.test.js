import enumMap from '../../../../app/graphql/schema/comms-message/enum-map.js'
import getCommsEventByProperty from '../../../../app/graphql/resolvers/comms-message/get-comms-event-by-property.js'
import db from '../../../../app/data/index.js'
import { expect } from '@jest/globals'
import validJSONCommsMessage from '../../../mocks/comms-message/valid-comms-message.js'

describe('commsByProperty', () => {
  beforeAll(async () => {
    await db.commsEvent.create(validJSONCommsMessage)
  })

  afterAll(async () => {
    await db.commsEvent.destroy({ where: {} })
  })

  test.each(Object.entries(enumMap))('should map key %s to %s and query the database', async (key, mappedKey) => {
    const value = 'testValue'
    const results = await getCommsEventByProperty(null, { key, value })
    expect(results).toBeDefined()
    expect(Array.isArray(results)).toBe(true)
    if (results.length > 0) {
      if (mappedKey.startsWith('data.')) {
        const dataKey = mappedKey.split('data.')[1]
        expect(results[0].commsMessage.data).toHaveProperty(dataKey)
      } else {
        expect(results[0].commsMessage).toHaveProperty(mappedKey)
      }
    }
  })
})
