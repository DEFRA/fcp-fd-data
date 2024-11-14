import db from '../../../data/index.js'
import CommsEnum from '../../schema/comms-message/comms-message-enum.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = CommsEnum.getValue(key)?.value

  if (!isNaN(value)) {
    value = parseInt(value)
  }
  return await db.commsEvent.findAll({
    where: db.Sequelize.where(
      db.Sequelize.cast(db.Sequelize.json(mappedKey), 'text')
    )
  })
}

export default commsByProperty
