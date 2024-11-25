import { Op } from 'sequelize'
import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  if (mappedKey === 'data,commsAddresses') {
    try {
      const result = await db.commsEvent.findAll({
        where: {
          [Op.or]: [
            // Case 1: commsAddresses is a string
            db.sequelize.where(
              db.sequelize.json(`commsMessage.${mappedKey}`),
              { [Op.eq]: value }
            ),
            // Case 2: commsAddresses is an array
            db.sequelize.where(
              db.sequelize.cast(db.sequelize.json(`commsMessage.${mappedKey}`), 'jsonb'),
              { [Op.contains]: db.sequelize.literal(`'["${value}"]'::jsonb`) }
            )
          ]
        }
      })

      console.log('*****', result)
      return result
    } catch (error) {
      throw new Error(`Error executing query: ${error.message}`)
    }
  }

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
