import db from '../../../../data/index.js'
import enumMap from '../../../schema/comms-message/enum-map.js'
import buildQuery from './build-query.js'

const getCommsEventByProperty = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  const values = Array.isArray(value) ? value.map(String) : [String(value)]

  try {
    const query = buildQuery(mappedKey, values)

    const commsEventRecords = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      model: db.commsEvent
    })

    return commsEventRecords.map(record => ({
      id: record.dataValues.id,
      dateCreated: record.dataValues.dateCreated,
      commsMessage: record.dataValues.commsMessage
    }))
  } catch (error) {
    console.error('Error fetching comms event by property', error)
    throw new Error(error.message)
  }
}

export default getCommsEventByProperty
