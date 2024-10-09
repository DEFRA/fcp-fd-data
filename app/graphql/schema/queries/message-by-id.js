import db from '../../../data/index.js'

const messageById = async (_root, args, context) => {
  const response = await db.initial.findOne({
    where: { id: args.id }
  })

  return {
    id: response.id,
    message: response.message
  }
}

export default messageById
