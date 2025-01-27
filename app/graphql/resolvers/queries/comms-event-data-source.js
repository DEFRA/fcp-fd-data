import DataLoader from 'dataloader'
import { Op } from 'sequelize'

class CommsEventDataSource {
  constructor (db) {
    if (!db) {
      throw new Error('Database instance is required')
    }
    this.db = db

    // Create a DataLoader for batching key-value pairs
    this.eventByPropertyLoader = new DataLoader(async (queries) => {
      // queries is an array of { mappedKey, value } pairs
      const conditions = queries.flatMap(({ mappedKey, value }) => {
        if (Array.isArray(value)) {
          return value.map(v => ({ [`commsMessage.${mappedKey}`]: v }))
        } else {
          return { [`commsMessage.${mappedKey}`]: value }
        }
      })
      console.log('Conditions:', conditions)

      // Combine all conditions into a single database call
      const results = await this.db.commsEvent.findAll({
        where: { [Op.or]: conditions } // Sequelize's OR operator
      })
      console.log('Results:', results)

      // Map results back to the queries
      const mappedResults = queries.map(query => {
        const matchingResults = results.filter(result => {
          const commsMessage = result.dataValues.commsMessage
          console.log('Checking result:', commsMessage, 'for query:', query)

          // Access nested properties dynamically
          const keys = query.mappedKey.split('.')
          let value = commsMessage
          for (const key of keys) {
            value = value[key]
            if (value === undefined) break
          }

          // Handle both string and array comparisons
          if (Array.isArray(query.value)) {
            return query.value.includes(value)
          } else {
            return value === query.value
          }
        })
        return matchingResults
      })
      console.log('Mapped Results:', mappedResults)
      return mappedResults
    })
  }

  // Batch fetch events by property
  async findEventByProperty (mappedKey, value) {
    console.log(`Fetching event by property: ${mappedKey} = ${value}`)
    return this.eventByPropertyLoader.load({ mappedKey, value })
  }
}

export default CommsEventDataSource
