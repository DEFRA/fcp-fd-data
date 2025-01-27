import typeDefinitions from './schema/comms-message/type-definitions.js'
import userTypeDefinitions from './schema/comms-message/new-type-defitions.js'
import resolvers from './resolvers/index.js'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = [userTypeDefinitions, typeDefinitions]

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
