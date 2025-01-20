import db from '../../../app/data/index.js'
import { VALID_METADATA } from '../../mocks/file-metadata/valid.js'
import getMetadata from './queries/get-metadata.js'
import registerApollo from '../../../app/server/start.js'
import createTestCases from '../../helper-functions/create-database-entries.js'

describe('Query by file metadata', () => {
  let server

  beforeAll(async () => {
    await createTestCases(VALID_METADATA, db.fileMetadata, { 'metadata.data.sbi': '123456789' }, 1)
    await createTestCases(VALID_METADATA, db.fileMetadata, { 'metadata.data.sbi': '987654321' }, 1)
    server = await registerApollo()
    await server.start()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
    await server.stop()
  })

  test('fetches metadata by SBI', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...getMetadata,
        variables: {
          key: 'SBI',
          value: '123456789'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result).data.getMetadata
    const { id, ...expectedMetadata } = VALID_METADATA

    expect(responseBody.errors).toBeUndefined()
    expect(Array.isArray(responseBody)).toBe(true)
    expect(responseBody[0].metadata.data.sbi).toBe('123456789')
    expect(responseBody[0]).toMatchObject(expectedMetadata)
  })

  test('fetches metadata by blob reference', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...getMetadata,
        variables: {
          key: 'BLOB_REFERENCE',
          value: '550e8400-e29b-41d4-a716-446655440000'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result).data.getMetadata
    const { id, ...expectedMetadata } = VALID_METADATA

    expect(responseBody.errors).toBeUndefined()
    expect(Array.isArray(responseBody)).toBe(true)
    expect(responseBody[0].metadata.data.blobReference).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(responseBody[0]).toMatchObject(expectedMetadata)
  })

  test('fetches metadata by SBI array', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...getMetadata,
        variables: {
          key: 'SBI',
          value: ['123456789', '987654321']
        }
      })
    }

    // console.log('Request payload:', JSON.stringify(options.payload, null, 2))

    const response = await server.inject(options)

    // console.log('Response:', response.result)

    const responseBody = JSON.parse(response.result)

    // console.log('Raw response:', response.result)

    // console.log(responseBody.data.getMetadata[0])
    // console.log(responseBody.data.getMetadata[1])

    // console.log('Full response structure:', JSON.stringify(responseBody, null, 2))

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    expect(responseBody.data.getMetadata[0].metadata.data.sbi).toBe('123456789')
    expect(responseBody.data.getMetadata[1].metadata.data.sbi).toBe('987654321')
    expect(responseBody.data.getMetadata.length).toBe(2)
  })
})
