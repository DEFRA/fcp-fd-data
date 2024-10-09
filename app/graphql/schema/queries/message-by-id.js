import db from '../../../data/index.js'

const messageById = async (_root, args, context) => {
  const querySpec = {
    query: 'SELECT * FROM initial i WHERE i.id = @id',
    parameters: [{ name: '@id', value: `${args.id}` }]
  }

  const response = await db.query(querySpec)
  const message = response.rows[0]

  return {
    id: message.id,
    message: message.message
  }
}

export default messageById
