import db from '../../../data/index.js'

const commsEvent = async (_, { id }) => {
  return await db.commsEvent.findByPk(id)
}

export default commsEvent
