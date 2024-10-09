import {
  messageById,
  allMessages
} from './queries/index.js'

import {
  createMessage
} from './mutations/index.js'

const resolvers = {
  Query: {
    messageById,
    allMessages
  },
  Mutation: {
    createMessage
  }
}

export { resolvers }
