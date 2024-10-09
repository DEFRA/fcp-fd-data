import db from '../../../data/index.js'

const allMessages = async (_root, args, context) => {
  const response = await db.initial.findAll()

  return response.map(message => ({
    id: message.id,
    message: message.message
  }))
}

export default allMessages
