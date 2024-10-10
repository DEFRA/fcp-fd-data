import { jest } from '@jest/globals'
import config from '../../../app/config/database.js'

describe('Database Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should set ssl to false when isProd returns False', () => {
    process.env.NODE_ENV = 'production' // this is not being set correctly, possibly the way I am importing it
    console.log(config)
    expect(config.dialectOptions.ssl).toBe(false)
  })

  // test('should have the correct dialect', () => {
  //   // Test code for dialect
  // })

  // test('should have the correct host', () => {
  //   // Test code for host
  // })
})
