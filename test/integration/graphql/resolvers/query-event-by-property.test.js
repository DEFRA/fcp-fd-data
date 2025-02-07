import db from '../../../../app/data/index.js'
import validCommsMessage from '../../../mocks/comms-message/valid-comms-message.js'
import commsEventByPropertyQuery from '../queries/comms-by-property.js'
import registerApollo from '../../../../app/server/start.js'
import createTestCases from '../../../helper-functions/create-database-entries.js'

let server

const setupTestCases = async () => {
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.crn': '1050000000' }, 2)
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.crn': '223456789', 'commsMessage.data.commsAddresses': 'test-commsAddress' }, 1)
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.crn': '223456790', 'commsMessage.data.commsAddresses': ['commsAddress1', 'commsAddress2'] }, 1)
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.commsAddresses': 'commsAddress1' }, 2)
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.reference': 'ffc-ahwr-example-reference' }, 1)
  await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.reference': 'ffc-ahwr-another-example-reference' }, 1)
}

beforeAll(async () => {
  server = await registerApollo()
  await server.start()
})

beforeEach(async () => {
  await setupTestCases()
})

afterEach(async () => {
  await db.sequelize.truncate({ cascade: true })
})

afterAll(async () => {
  await db.sequelize.close()
  await server.stop()
})

describe('GQL queries', () => {
  test('returns all commsEvents with corresponding CRN', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '1050000000'
        }
      })
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(6)
    expect(responseBody.data.commsEventByProperty[0].commsMessage).toStrictEqual(validCommsMessage.commsMessage)
  })

  test('returns a single commsEvent by CRN when multiple records in database', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '223456789'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(1)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe('223456789')
  })

  test('returns all records with same REFERENCE when CRNs are different', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: 'ffc-ahwr-example-reference'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(7)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe('1050000000')
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.crn).toBe('1050000000')
    expect(responseBody.data.commsEventByProperty[2].commsMessage.data.crn).toBe('223456789')
  })

  test('returns commsAddresses as an array when it is an array in the database', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '223456790'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe('223456790')
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.commsAddresses).toStrictEqual(['commsAddress1', 'commsAddress2'])
  })

  test('returns commsAddresses as a string when it is a string in the database', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '1050000000'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe('1050000000')
    expect(responseBody.data.commsEventByProperty[0].commsMessage).toStrictEqual(validCommsMessage.commsMessage)
  })

  test('returns mixed commsAddresses types correctly', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'SOURCE_SYSTEM',
          value: 'newsourceSystem'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(6)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe('223456789')
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.commsAddresses).toStrictEqual('test-commsAddress')
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.crn).toBe('223456790')
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.commsAddresses).toStrictEqual(['commsAddress1', 'commsAddress2'])
  })

  test('returns all commsAddress records for commsAddress where commsAddress type is String and/or Array of Strings', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'COMMS_ADDRESSES',
          value: 'commsAddress1'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.commsAddresses).toStrictEqual(['commsAddress1', 'commsAddress2'])
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.commsAddresses).toStrictEqual('commsAddress1')
    expect(responseBody.data.commsEventByProperty[2].commsMessage.data.commsAddresses).toStrictEqual('commsAddress1')
    expect(responseBody.data.commsEventByProperty.length).toBe(3)
  })

  test('fetches commsEvents by single reference', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: 'ffc-ahwr-example-reference'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(Array.isArray(responseBody.data.commsEventByProperty)).toBe(true)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.reference).toBe('ffc-ahwr-example-reference')
  })

  test('fetches commsEvents by array of references', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: ['ffc-ahwr-example-reference', 'ffc-ahwr-another-example-reference']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.filter(record => record.commsMessage.data.reference === 'ffc-ahwr-example-reference').length).toBe(7)
    expect(responseBody.data.commsEventByProperty.filter(record => record.commsMessage.data.reference === 'ffc-ahwr-another-example-reference').length).toBe(1)
    expect(responseBody.data.commsEventByProperty.length).toBe(8)
  })

  test('throws error for unsupported value type (object)', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: { reference: 'ffc-ahwr-example-reference' }
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
  })

  test('throws error for unsupported value type (int)', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: 123456789
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
  })

  test('throws error for nested array', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: ['ffc-ahwr-example-reference', ['ffc-ahwr-another-example-reference']]
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
  })

  test('throws an error when key is not provided', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          value: 'ffc-ahwr-example-reference'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$key" of required type "commsEnum!" was not provided.')
  })

  test('returns empty array for no matching values', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'REFERENCE',
          value: 'INVALID_VALUE'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(0)
  })

  test('should return all records that contain a matching commsAddress when querying with an array', async () => {
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': ["test1", "test2"] }, 1) //eslint-disable-line
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': 'test1' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': 'test2' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': 'test3' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': 'test4' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.commsAddresses': ['test3', 'test4'] }, 1)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'COMMS_ADDRESSES',
          value: ['test1', 'test2', 'test3', 'test4']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(6)
  })

  test('should return all records when querying on a property not nested within data property', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'TYPE',
          value: 'uk.gov.fcp.sfd.notification.request'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(8)
  })
})
