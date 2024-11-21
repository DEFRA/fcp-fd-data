import { v4 as uuidv4 } from 'uuid'

/**
 * Create test cases dynamically :
 * @param {Object} baseCase - The base object with default key-value pairs
 * @param {Object} dbTable - The database table where records will be inserted
 * @param {Object} customProps - An object with properties to override in the base case
 * @param {number} recordCount - Number of records to create
 */
const createTestCases = async (baseCase, dbTable, customProps = {}, recordCount = 1) => {
  const records = []

  for (let i = 0; i < recordCount; i++) {
    const record = JSON.parse(JSON.stringify(baseCase))

    Object.entries(customProps).forEach(([key, value]) => {
      key.split('.').reduce((target, k, i, keys) => {
        if (i === keys.length - 1) {
          target[k] = value
        } else {
          target[k] = target[k] || {}
        }
        return target[k]
      }, record)
    })
    if (!customProps.id) {
      record.id = uuidv4()
    }

    records.push(record)
  }
  await dbTable.bulkCreate(records)
}

export default createTestCases
