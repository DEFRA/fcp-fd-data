import db from '../../../app/data/index.js'
import { VALID_METADATA } from '../../mocks/file-metadata/valid.js'
import getMetadata from './queries/get-metadata.js'
import registerApollo from '../../../app/server/start.js'
import createTestCases from '../../helper-functions/create-database-entries.js'

describe('Query by file metadata', () => {
  let server

  beforeAll(async () => {
    await createTestCases(VALID_METADATA, db.fileMetadata, { 'metadata.data.sbi': '123456789', 'metadata.data.blobReference': '550e8400-e29b-41d4-a716-446655440000' }, 1)
    await createTestCases(VALID_METADATA, db.fileMetadata, { 'metadata.data.sbi': '987654321', 'metadata.data.blobReference': '550e8400-e29b-41d4-a716-446655440001' }, 1)
    server = await registerApollo()
    await server.start()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
    await server.stop()
  })

  test('fetches metadata by single SBI', async () => {
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

  test('fetches metadata by array of SBIs', async () => {
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

    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    expect(responseBody.data.getMetadata[0].metadata.data.sbi).toBe('123456789')
    expect(responseBody.data.getMetadata[1].metadata.data.sbi).toBe('987654321')
    expect(responseBody.data.getMetadata.length).toBe(2)
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

  test('fetches metadata by array of blob references', async () => {
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
          value: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    expect(responseBody.data.getMetadata[0].metadata.data.blobReference).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(responseBody.data.getMetadata[1].metadata.data.blobReference).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(responseBody.data.getMetadata.length).toBe(2)
  })

  test('throws error for unsupported value type (object)', async () => {
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
          value: { sbi: '123456789' }
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
        ...getMetadata,
        variables: {
          key: 'SBI',
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
        ...getMetadata,
        variables: {
          key: 'SBI',
          value: [['123456789']]
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
  })

  test('throws error for invalid key', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...getMetadata,
        variables: {
          key: 'INVALID_KEY',
          value: '123456789'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Variable "$key" got invalid value')
  })

  test('fetches metadata with one valid value and one invalid value', async () => {
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
          value: ['123456789', 'INVALID_VALUE']
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    expect(responseBody.data.getMetadata.length).toBe(1)
    expect(responseBody.data.getMetadata[0].metadata.data.sbi).toBe('123456789')
  })

  test('returns empty array for no matching values', async () => {
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
          value: 'INVALID_VALUE'
        }
      })
    }

    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    expect(responseBody.data.getMetadata.length).toBe(0)
  })
})
