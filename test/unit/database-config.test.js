import { expect, jest } from '@jest/globals'
const configPath = '../../app/config/database.js'

jest.mock('@azure/identity', () => {
  return {
    DefaultAzureCredential: jest.fn().mockImplementation(() => {
      return {
        getToken: jest.fn().mockResolvedValue({ token: 'mocked-access-token' })
      }
    })
  }
})
describe('Database Configuration', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = ''
  })

  test('should not update config.password when NODE_ENV is "production"', async () => {
    delete process.env.POSTGRES_PASSWORD
    process.env.NODE_ENV = 'development'
    const config = await import(configPath)
    await config.default.hooks.beforeConnect(config.default)
    expect(config.default.password).toBeUndefined()
  })

  test('should update config.password when NODE_ENV is "development"', async () => {
    delete process.env.POSTGRES_PASSWORD
    process.env.NODE_ENV = 'production'
    const config = await import(configPath)
    await config.default.hooks.beforeConnect(config.default)
    expect(config.default.password).toBe('mocked-access-token')
  })
})
