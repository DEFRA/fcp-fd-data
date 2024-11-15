import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import { COMMS_DATABASE_PATH } from '../../../constants/comms-database-path.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]

  if (!isNaN(value)) {
    value = parseInt(value)
  }
  return await db.commsEvent.findAll({
    where: db.Sequelize.where(
      db.Sequelize.cast(db.Sequelize.json(`${COMMS_DATABASE_PATH}${mappedKey}`), 'text')
    )
  })
}

export default commsByProperty
