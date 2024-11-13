import db from '../../../data/index.js'

const commsEvent = async (_, { id }) => {
  const event = await db.commsEvent.findByPk(id)
  if (event) {
    event.dateCreated = event.dateCreated.toISOString()
  }
  console.log('Event:', event)
  return event
}

export default commsEvent
