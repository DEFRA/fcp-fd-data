import db from '../../../data/index.js'

const createMessage = async (_root, args, context) => {
  const querySpec = {
    query: 'INSERT INTO initial (message) VALUES (@message)',
    parameters: [{ name: '@message', value: `${args.message}` }]
  }

  const response = await db.query(querySpec)
  const message = response.rows[0]

  return {
    id: message.id,
    message: message.message
  }
}

export default createMessage
