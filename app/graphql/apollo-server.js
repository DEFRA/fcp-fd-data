import { ApolloServer } from '@apollo/server'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'

export default new ApolloServer({
  typeDefs,
  resolvers
})
