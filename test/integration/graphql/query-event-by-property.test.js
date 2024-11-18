import { createServer } from '../../../app/server.js'
import apolloServer from '../../../app/graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'
import db from '../../../app/data/index.js' // Adjust the path as necessary
import validCommsMessage from '../../mocks/valid-comms-message-json-object.js'
import commsByPropertyQuery from './queries/comms-by-property.js'

// TODO create mock data for the query
// TODO create wrapper function for setting up hapi and GQL server
// TODO create helper function for inserting records into the database

describe('GQL queries', () => {
  let server

  beforeAll(async () => {
    await db.commsEvent.create(validCommsMessage)
    validCommsMessage.id = '123e4567-e89b-12d3-a456-426655440051'
    await db.commsEvent.create(validCommsMessage)
    await apolloServer.start()
    server = await createServer()
    await server.initialize()
    await server.register({
      plugin: hapiApollo.default,
      options: {
        apolloServer,
        path: '/graphql'
      }
    })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
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
    expect(responseBody.data.commsByProperty.length).toBe(2)
    expect(responseBody.data.commsByProperty[0].commsMessage.data.crn).toBe(1234567890)
  })

  test('returns a single commsEvent by CRN when multiple records in database', async () => {
    validCommsMessage.id = '123e4567-e89b-12d3-a456-426655440055'
    validCommsMessage.commsMessage.data.crn = '223456789'
    await db.commsEvent.create(validCommsMessage)

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
