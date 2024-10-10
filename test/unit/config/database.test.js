import { jest } from '@jest/globals'
// import config from '../../../app/config/database.js'
const configPath = '../../../app/config/database.js'

describe('Database Configuration', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('should set ssl to false when NODE_ENV is "development"', async () => {
    process.env.NODE_ENV = 'development' // this is not being set correctly, possibly the way I am importing it
    const result = await import(configPath)
    expect(result.default.dialectOptions.ssl).toBe(false)
  })

  test('should set ssl to true when NODE_ENV is "production"', async () => {
    process.env.NODE_ENV = 'production' // this is not being set correctly, possibly the way I am importing it
    const result = await import(configPath)
    expect(result.default.dialectOptions.ssl).toBe(true)
  })

  // test('should have the correct dialect', () => {
  //   // Test code for dialect
  // })

  // test('should have the correct host', () => {
  //   // Test code for host
  // })
})
