import { createServer } from '../../../app/server.js'
import apolloServer from '../../../app/graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'
import db from '../../../app/data/index.js' // Adjust the path as necessary
import validCommsMessage from '../../mocks/valid-comms-message-json-object.js'

// TODO create mock data for the query
// TODO create wrapper function for setting up hapi and GQL server
const queryData = {
  query: `query CommsEventById($commsEventByIdId: String!) {
  commsEventById(id: $commsEventByIdId) {
    id
    dateCreated
    commsMessage {
      id
      data {
        crn
        sbi
        commsType
        reference
        commsAddress
        sourceSystem
        emailReplyToId
        statusDetails
        coorelationId
        personalisation
      }
      time
      type
      source
      specversion
      datacontenttype
    }
  }
}`,
  variables: {
    commsEventByIdId: '123e4567-e89b-12d3-a456-426655440000'
  }
}

describe('e2e dem', () => {
  let server

  beforeAll(async () => {
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

  beforeEach(async () => {
  })

  afterEach(async () => {
  })

  // after the tests we'll stop the server
  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  // describe block called GraphQL query tests for commsEvent queries use test not it
  test('fetches commsEvent by id', async () => {
    // send our request to the url of the test server
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(queryData)
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    console.log('responseBody', responseBody)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventById).toBeDefined()
    expect(responseBody.data.commsEventById.commsMessage.data.sbi).toBe(987654321)
    expect(responseBody.data.commsEventById.commsMessage.data.commsAddress).toBe('test-commsAddress')
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
