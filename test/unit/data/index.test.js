import { jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'
import { databaseConfig } from '../../../app/config/index.js'

jest.mock('fs')
jest.mock('path')
jest.mock('sequelize')

jest.mock('../../../app/config/index.js', () => ({
  databaseConfig: {
    database: 'testdb',
    username: 'testuser',
    password: 'testpassword',
    dialect: 'postgres'
  }
}))

describe('Database Initialisation', () => {
  let mockSequelizeInstance

  beforeEach(() => {
    mockSequelizeInstance = {
      define: jest.fn(),
      authenticate: jest.fn().mockResolvedValue(),
      models: {}
    }

    Sequelize.mockImplementation = jest.fn(() => mockSequelizeInstance)

    fs.readdirSync = jest.fn().mockReturnValue(['initial.js'])

    path.join = jest.fn().mockImplementation((...args) => args.join('/'))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialise Sequelize with the correct configuration', async () => {
    const dbModule = await import('../../../app/data/index.js')
    const db = dbModule.default

    expect(Sequelize).toHaveBeenCalledWith(
      databaseConfig.database,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig
    )

    expect(db.sequelize).toBe(mockSequelizeInstance)
    expect(db.Sequelize).toBe(Sequelize)
  })

  it('should load all model files from the models directory', async () => {
    const dbModule = await import('../../../app/data/index.js')
    const db = dbModule.default

    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('models'))

    expect(Object.keys(db)).toContain('initial')
  })
})
