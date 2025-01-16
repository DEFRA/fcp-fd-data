import db from '../../../app/data/index.js'
import { VALID_METADATA } from '../../mocks/file-metadata/valid.js'
import getMetadata from './queries/get-metadata.js'
import registerApollo from '../../../app/server/start.js'
import createTestCases from '../../helper-functions/create-database-entries.js'

describe('Query by file metadata', () => {
  let server

  beforeAll(async () => {
    await createTestCases(VALID_METADATA, db.fileMetadata, { }, 1)
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
    // console.log('Response:', response)

    const responseBody = JSON.parse(response.result)
    // console.log('Response Body:', responseBody)

    expect(responseBody.errors).toBeUndefined()
    expect(responseBody.data.getMetadata).toBeDefined()
    console.log('Metadata:', responseBody.data.getMetadata)
    expect(responseBody.data.getMetadata.data.sbi).toBe(123456789)

    // expect(responseBody.data.getMetadata[0].metadata.data.sbi).toBe(123456789)
    // expect(responseBody.data.commsEventByPK.commsMessage.data.commsAddresses).toStrictEqual(validCommsMessage.commsMessage.data.commsAddresses)
  })
})
