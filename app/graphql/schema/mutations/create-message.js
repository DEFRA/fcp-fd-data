import db from '../../../data/index.js'

const createMessage = async (_root, args, context) => {
  const newMessage = await db.initial.create({
    message: args.message
  })

  return {
    id: newMessage.id,
    message: newMessage.message
  }
}

export default createMessage
