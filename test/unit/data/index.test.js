/** For a test you'll need to import Jest (applicable only to ESM),
 * all the dependecies of the file you're testing and the export
 * within the file itself. */
import { jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'
import { DefaultAzureCredential } from '@azure/identity'
import { db } from '../../../app/data/index.js'
import { databaseConfig } from '../../../app/config/index.js'

// Mock dependecies imported from above
jest.mock('fs')
jest.mock('path')
jest.mock('sequelize')

jest.mock('@azure/identity', () => {
  DefaultAzureCredential: jest.fn().mockImplementation(() => {
    getToken: jest.fn().mockResolvedValue({ token: 'mock-access-token' })
  })
})

jest.mock('../../../app/config/index.js', () => ({
  config: {
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

})
