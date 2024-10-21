import { expect, jest } from '@jest/globals'

jest.unstable_mockModule('sequelize', () => {
  return {
    Sequelize: jest.fn(() => ({
      define: jest.fn().mockImplementation((modelName) => {
        return {
          name: modelName,
          associate: jest.fn()
        }
      })
    })),
    DataTypes: {
      INTEGER: 'INTEGER',
      STRING: 'STRING'
    }
  }
})

jest.unstable_mockModule('../../../app/config/index.js', () => ({
  databaseConfig: {
    database: 'testdb',
    username: 'testuser',
    password: 'testpassword'
  }
}))

describe('Data Module Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should create new sequelize object with mockConfig values', async () => {
    const mockConfig = (await import('../../../app/config/index.js')).databaseConfig
    const mockSequelize = (await import('sequelize')).Sequelize
    await import('../../../app/data/index.js')
    expect(mockSequelize).toBeCalledWith(mockConfig.database, mockConfig.username, mockConfig.password, mockConfig)
  })

  test('should call mockSequelize once', async () => {
    const mockSequelize = (await import('sequelize')).Sequelize
    await import('../../../app/data/index.js')
    expect(mockSequelize).toBeCalledTimes(1)
  })

  test('should set "initial" as a property of the database object', async () => {
    const dbModule = await import('../../../app/data/index.js')
    const db = dbModule.default
    expect(db.initial).toBeDefined()
  })

  test('should set "initial" as a property of the database object with "name" of "initial" and "associate" as a function', async () => {
    const dbModule = await import('../../../app/data/index.js')
    const db = dbModule.default
    expect(db.initial).toEqual({ name: 'initial', associate: expect.any(Function) })
  })
})
