import db from '../../../../app/data/index.js'
import validCommsMessage from '../../../mocks/comms-message/valid-comms-message.js'
import commsEventByPropertyQuery from '../queries/comms-by-property.js'
import registerApollo from '../../../../app/server/start.js'
import createTestCases from '../../../helper-functions/create-database-entries.js'

describe('GQL queries', () => {
  let server

  beforeAll(async () => {
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.crn': 1234567890 }, 2)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.crn': 223456789, 'commsMessage.data.commsAddresses': 'test-commsAddress' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.crn': 223456790, 'commsMessage.data.commsAddresses': ['commsAddress1', 'commsAddress2'] }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.commsAddresses': 'commsAddress1' }, 2)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.reference': 'ffc-ahwr-example-reference' }, 1)
    await createTestCases(validCommsMessage, db.commsEvent, { 'commsMessage.data.sourceSystem': 'newsourceSystem', 'commsMessage.data.reference': 'ffc-ahwr-another-example-reference' }, 1)
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
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '1234567890'
        }
      })
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.commsEventByProperty).toBeDefined()
    expect(responseBody.data.commsEventByProperty.length).toBe(2)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(1234567890)
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(223456789)
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(1234567890)
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.crn).toBe(1234567890)
    expect(responseBody.data.commsEventByProperty[2].commsMessage.data.crn).toBe(223456789)
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(223456790)
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(1050000000)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.commsAddresses).toStrictEqual('commsAddress1')
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.crn).toBe(223456789)
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.commsAddresses).toStrictEqual('test-commsAddress')
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.crn).toBe(223456790)
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

  test('returns all commsEvents with corresponding reference', async () => {
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.reference).toBe('ffc-ahwr-example-reference')
    expect(responseBody.data.commsEventByProperty[1].commsMessage.data.reference).toBe('ffc-ahwr-example-reference')
  })

  test('returns all commsEvents by reference array', async () => {
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
    expect(responseBody.data.commsEventByProperty[0].commsMessage.data.reference).toBe('ffc-ahwr-example-reference')
    expect(responseBody.data.commsEventByProperty[7].commsMessage.data.reference).toBe('ffc-ahwr-another-example-reference')
    expect(responseBody.data.commsEventByProperty.length).toBe(8)
  })
})
