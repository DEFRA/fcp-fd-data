import { createServer } from '../../../app/server.js'
import apolloServer from '../../../app/graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'
import db from '../../../app/data/index.js' // Adjust the path as necessary
import validCommsMessage from '../../mocks/valid-comms-message-json-object.js'

// TODO create mock data for the query
// TODO create wrapper function for setting up hapi and GQL server
const queryData = {
  query: `query CommsByProperty($key: commsEnum!, $value: String!) {
          commsByProperty(key: $key, value: $value) {
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
    key: 'CRN',
    value: '1234567890'
  }
}

describe('e2e dem', () => {
  let server

  beforeAll(async () => {
    await db.commsEvent.create(validCommsMessage)
  })

  beforeEach(async () => {
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
    console.log('responseBody', responseBody.data.commsByProperty[0].id)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsByProperty).toBeDefined()
    expect(responseBody.data.commsByProperty[0].commsMessage.data.crn).toBe(1234567890)
    expect(responseBody.data.commsByProperty[0].commsMessage.data.commsAddress).toBe('test-commsAddress')
  })
})
