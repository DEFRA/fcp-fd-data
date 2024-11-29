import commsEnumMap from '../../../../app/graphql/schema/comms-message/comms-enum-map.js'
import commsByProperty from '../../../../app/graphql/resolvers/queries/get-by-property.js'
import db from '../../../../app/data/index.js'
import { expect } from '@jest/globals'
import validJSONCommsMessage from '../../../mocks/valid-comms-message-json-object.js'

describe('commsByProperty', () => {
  beforeAll(async () => {
    await db.commsEvent.create(validJSONCommsMessage)
  })

  afterAll(async () => {
    await db.commsEvent.destroy({ where: {} })
  })

  test.each(Object.entries(commsEnumMap))('should map key %s to %s and query the database', async (key, mappedKey) => {
    const value = 'testValue'
    const results = await commsByProperty(null, { key, value })
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
