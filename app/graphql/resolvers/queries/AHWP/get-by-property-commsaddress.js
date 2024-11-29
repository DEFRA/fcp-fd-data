import { Op } from 'sequelize'
import db from '../../../../data/index.js'

const getCommsEventByCommsAddresses = async (mappedKey, value) => {
  return await db.commsEvent.findAll({
    where: {
      [Op.or]: [
        { [`commsMessage.${mappedKey}`]: value },
        { [`commsMessage.${mappedKey}`]: { [Op.contains]: JSON.stringify([value]) } }
      ]
    }
  })
}

export default getCommsEventByCommsAddresses
