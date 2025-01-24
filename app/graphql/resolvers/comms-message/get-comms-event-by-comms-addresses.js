import db from '../../../data/index.js'
import { Op } from 'sequelize'

const getCommsEventByCommsAddresses = async (mappedKey, value) => {
  return db.commsEvent.findAll({
    where: {
      [Op.or]: [
        { [`commsMessage.${mappedKey}`]: value },
        { [`commsMessage.${mappedKey}`]: { [Op.contains]: JSON.stringify([value]) } }
      ]
    }
  })
}

export default getCommsEventByCommsAddresses
