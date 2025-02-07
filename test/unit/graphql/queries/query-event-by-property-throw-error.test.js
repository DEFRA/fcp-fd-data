import getCommsEventByProperty from '../../../../app/graphql/resolvers/comms-message/get-comms-event-by-property.js'
import db from '../../../../app/data/index.js'
import { jest } from '@jest/globals'

describe('commsByProperty query unit test', () => {
  test('should throw an error when sequelize execution fails', async () => {
    const mockError = new Error('Query execution failed')
    jest.spyOn(db.sequelize, 'query').mockImplementation(() => {
      throw mockError
    })

    const result = async () => { await getCommsEventByProperty(null, { key: 'SOURCE', value: 'someValue' }) }
    expect(result).rejects.toThrowError('Query execution failed')
  })
})
