import db from '../../../app/data/index.js'
import validCommsMessage from '../../mocks/valid-comms-message-json-object.js'
import commsByIdQuery from './queries/comms-by-id.js'
import registerApollo from '../../../app/server/start.js'
import createTestCases from '../../helper-functions/create-database-entries.js'

describe('GQL get by ID', () => {
  let server

  beforeAll(async () => {
    await createTestCases(validCommsMessage, db.commsEvent, { id: '123e4567-e89b-12d3-a456-426655440000' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { }, 1)
    server = await registerApollo()
    await server.start()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('fetches commsEvent by id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsByIdQuery,
        variables: {
          commsEventByIdId: '123e4567-e89b-12d3-a456-426655440000'
        }
      })
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventById).toBeDefined()
    expect(responseBody.data.commsEventById.commsMessage.data.sbi).toBe(987654321)
    expect(responseBody.data.commsEventById.commsMessage.data.commsAddress).toBe('test-commsAddress')
  })
  test('returns only one record when searching by id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsByIdQuery,
        variables: {
          commsEventByIdId: '123e4567-e89b-12d3-a456-426655440000'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventById).toBeDefined()
    expect(Array.isArray(responseBody.data.commsEventById)).toBe(false)
    expect(responseBody.data.commsEventById.id).toBe('123e4567-e89b-12d3-a456-426655440000')
  })

  test('returns null if event is not found', async () => {
    const queryDataNotFound = {
      query: `
        query CommsEventById($commsEventByIdId: String!) {
          commsEventById(id: $commsEventByIdId) {
            id
          }
        }
      `,
      variables: {
        commsEventByIdId: null
      }
    }

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(queryDataNotFound)
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$commsEventByIdId" of non-null type "String!" must not be null.')
  })
})
