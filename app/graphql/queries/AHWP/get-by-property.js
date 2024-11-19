import { Op } from 'sequelize'
import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  try {
    const result = await db.commsEvent.findAll({
      where: db.sequelize.where(
        db.sequelize.cast(db.sequelize.json(`commsMessage.${mappedKey}`), 'TEXT'),
        {
          [Op.eq]: value
        }
      )
    })

    return result
  } catch (error) {
    throw new Error(`Error executing query: ${error.message}`)
  }
}

export default commsByProperty
