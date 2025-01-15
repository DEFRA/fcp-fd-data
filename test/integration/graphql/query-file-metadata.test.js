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
          SBI: '123456789'
        }
      })
    }
    const response = await server.inject(options)

    const responseBody = JSON.parse(response.result)
    expect(responseBody.errors).toBeUndefined()
    // expect(responseBody.data.commsEventByPK).toBeDefined()
    // expect(responseBody.data.commsEventByPK.commsMessage.data.sbi).toBe(105000000)
    // expect(responseBody.data.commsEventByPK.commsMessage.data.commsAddresses).toStrictEqual(validCommsMessage.commsMessage.data.commsAddresses)
  })
})
