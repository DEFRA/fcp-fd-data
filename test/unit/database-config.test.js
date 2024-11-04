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

  test('should update config.database when env is undefined "', async () => {
    delete process.env.POSTGRES_DB
    const config = await import(configPath)
    expect(config.default.database).toBe('fcp_fd_data')
  })

  test('should update config.host when env is undefined ', async () => {
    delete process.env.POSTGRES_HOST
    const config = await import(configPath)
    expect(config.default.host).toBe('fcp-fd-data-postgres')
  })

  test('should update config.port when env is undefined ', async () => {
    delete process.env.POSTGRES_PORT
    const config = await import(configPath)
    expect(config.default.port).toBe(5432)
  })

  test('should update config.schema when env is undefined ', async () => {
    delete process.env.POSTGRES_SCHEMA_NAME
    const config = await import(configPath)
    expect(config.default.schema).toBe('public')
  })
})
