import { Op } from 'sequelize'
import db from '../../../data/index.js'

const escapeLikePattern = (str) => {
  return str.replace(/[%_\\]/g, '\\$&')
}

const queryCommsEvent = async (mappedKey, value) => {
  const escapedValue = escapeLikePattern(value)
  return await db.commsEvent.findAll({
    where: {
      [Op.or]: [
        db.sequelize.where(
          db.sequelize.json(`commsMessage.${mappedKey}`),
          {
            [Op.eq]: value
          }
        ),
        db.sequelize.where(
          db.sequelize.json(`commsMessage.${mappedKey}`),
          {
            [Op.iLike]: `%${escapedValue}%`
          }
        )
      ]
    }
  })
}

export default queryCommsEvent
