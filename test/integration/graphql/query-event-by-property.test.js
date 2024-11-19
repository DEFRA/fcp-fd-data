import db from '../../../app/data/index.js'
import validCommsMessage from '../../mocks/valid-comms-message-json-object.js'
import commsByPropertyQuery from './queries/comms-by-property.js'
import registerApollo from '../../../app/server/start.js'
import createTestCases from '../../helper-functions/create-database-entries.js'

describe('GQL queries', () => {
  let server

  beforeAll(async () => {
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.crn': 1234567890 }, 2)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.crn': 223456789 }, 1)
    server = await registerApollo()
    await server.start()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
    await server.stop()
  })

  test('returns all commsEvents with corresponding CRN', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '1234567890'
        }
      })
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsByProperty).toBeDefined()
    console.log('responseBody', responseBody.data.commsByProperty)
    expect(responseBody.data.commsByProperty.length).toBe(2)
    expect(responseBody.data.commsByProperty[0].commsMessage.data.crn).toBe(1234567890)
  })

  test('returns a single commsEvent by CRN when multiple records in database', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '223456789'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsByProperty).toBeDefined()
    expect(responseBody.data.commsByProperty.length).toBe(1)
    expect(responseBody.data.commsByProperty[0].commsMessage.data.crn).toBe(223456789)
  })

  test('returns all records with same REFERENCE when CRNs are different', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: 'test-reference'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsByProperty).toBeDefined()
    expect(responseBody.data.commsByProperty.length).toBe(3)
    expect(responseBody.data.commsByProperty[0].commsMessage.data.crn).toBe(1234567890)
    expect(responseBody.data.commsByProperty[1].commsMessage.data.crn).toBe(1234567890)
    expect(responseBody.data.commsByProperty[2].commsMessage.data.crn).toBe(223456789)
  })
})
