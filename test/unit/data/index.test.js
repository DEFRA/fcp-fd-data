import { jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { Sequelize } from 'sequelize'
import db from '../../../app/data/index.js'
import { databaseConfig } from '../../../app/config/index.js'

jest.mock('fs')
jest.mock('path')
jest.mock('sequelize')

jest.mock('../../../app/config/index.js', () => ({
  databaseConfig: {
    database: 'mock_fcp_fd_data',
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    hooks: {
      beforeConnect: jest.fn()
    },
    host: 'localhost',
    username: 'mock_username',
    password: 'mock_password',
    port: 5432,
    schema: 'public',
    logging: false,
    retry: {
      backoffBase: 500,
      backoffExponent: 1.1,
      match: [/SequelizeConnectionError/],
      max: 10,
      name: 'connection',
      timeout: 60000
    }
  }
}))

describe('Set up models using Sequelize', () => {
  let sequelizeMock
  let mockModel

  beforeEach(() => {
    jest.clearAllMocks()

    sequelizeMock = {
      define: jest.fn(),
      authenticate: jest.fn(),
    }

    Sequelize.mockImplementation(() => sequelizeMock)

    mockModel = {
      name: 'TestModel',
      associate: jest.fn()
    }

    fs.readdirSync.mockReturnValue(['testModel.js'])

    path.join.mockImplementation((...args) => args.join('/'))

    jest.mock('../../../app/data/models/testModel.js', () => {
      return (sequelize, DataTypes) => mockModel
    }, { virtual: true })
  })

  it('should set up models and associate them correctly', () => {
    const loadedDb = db

    expect(Sequelize).toHaveBeenCalledWith(
      databaseConfig.database,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig
    )

    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('models'))

    expect(loadedDb.TestModel).toBeDefined()
    expect(loadedDb.TestModel).toEqual(mockModel)

    expect(mockModel.associate).toHaveBeenCalledWith(loadedDb)
  })
})
