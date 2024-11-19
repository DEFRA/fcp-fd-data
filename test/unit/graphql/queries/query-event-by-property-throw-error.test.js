import commsByProperty from '../../../../app/graphql/queries/AHWP/get-by-property.js'
import db from '../../../../app/data/index.js'
import { jest } from '@jest/globals'

describe('commsByProperty Integration Test', () => {
  test('should throw an error when query execution fails', async () => {
    const mockError = new Error('Query execution failed')

    // Mock the db.commsEvent.findAll method to throw an error
    jest.spyOn(db.commsEvent, 'findAll').mockImplementation(() => {
      throw mockError
    })

    try {
      await commsByProperty(null, { key: 'someKey', value: 'someValue' })
    } catch (error) {
      expect(error.message).toBe(`Error executing query: ${mockError.message}`)
    }

    // Restore the original implementation
    db.commsEvent.findAll.mockRestore()
  })
})
