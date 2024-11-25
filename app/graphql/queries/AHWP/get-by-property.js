import { Op } from 'sequelize'
import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import queryCommsEvent from './get-by-property-commsaddress.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  try {
    if (mappedKey === commsEnumMap.COMMS_ADDRESSES) {
      const result = await queryCommsEvent(mappedKey, value)
      return result
    } else {
      const result = await db.commsEvent.findAll({
        where: db.sequelize.where(
          db.sequelize.cast(db.sequelize.json(`commsMessage.${mappedKey}`), 'TEXT'),
          {
            [Op.eq]: value
          }
        )
      })
      return result
    }
  } catch (error) {
    console.error(`Error executing query for key: ${key}, mappedKey: ${mappedKey}, value: ${value} - ${error.message}`)
    throw new Error(`Error executing query: ${error.message}`)
  }
}

export default commsByProperty
