import { jest } from '@jest/globals'

describe('Data Module Tests', () => {
  jest.mock('sequelize', () => {
    return {
      Sequelize: jest.fn(() => ({
        define: jest.fn(),
        authenticate: jest.fn(),
        sync: jest.fn(),
        close: jest.fn()
      }))
    }
  })

  jest.mock('fs', () => {
    return {
      readdirSync: jest.fn(() => ['app/data/models/initial.js'])
    }
  })

  test('should create new sequelize object with values from databaseConfig ', async () => {
    const db = await import('../../../app/data/index.js')
    console.log('test')
    console.log(db)
    // expect(mockSequelize.mock.calls[0][0].database).toBe('fcp_fd_data')
  })
})
