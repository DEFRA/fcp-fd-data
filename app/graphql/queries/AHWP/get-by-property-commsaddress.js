import { Op } from 'sequelize'
import db from '../../../data/index.js'

const queryCommsEvent = async (mappedKey, value) => {
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
            [Op.iLike]: `%${value}%`
          }
        )
      ]
    }
  })
}
export default queryCommsEvent
