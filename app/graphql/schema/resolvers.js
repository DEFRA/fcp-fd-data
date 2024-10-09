import {
  messageById
} from './queries/index.js'

import {
  createMessage
} from './mutations/index.js'

const resolvers = {
  Query: {
    messageById
  },
  Mutation: {
    createMessage
  }
}

export { resolvers }
