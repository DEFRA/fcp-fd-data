import { createServer } from '../../../../app/server/server.js'

describe('healthz test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })
  afterAll(async () => {
    await server.stop()
  })

  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
