import commsByProperty from '../../../../app/graphql/resolvers/queries/AHWP/get-by-property'
import db from '../../../../app/data/index.js'
import { jest } from '@jest/globals'

describe('commsByProperty query unit test', () => {
  test('should throw an error when sequelize execution fails', async () => {
    const mockError = new Error('Query execution failed')
    jest.spyOn(db.commsEvent, 'findAll').mockImplementation(() => {
      throw mockError
    })

    const result = async () => { await commsByProperty(null, { key: 'someKey', value: 'someValue' }) }
    expect(result).rejects.toThrowError('Error executing query: Query execution failed')
  })
})
