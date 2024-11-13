import db from '../../../data/index.js'

const commsEvents = async () => {
  return await db.commsEvent.findAll()
}

export default commsEvents
