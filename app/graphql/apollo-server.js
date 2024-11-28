import { ApolloServer } from '@apollo/server'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'
import { graphqlConfig } from '../config/index.js'
import pluginsList from './apollo-plugins/index.js'

export default new ApolloServer({
  typeDefs,
  resolvers,
  introspection: graphqlConfig.get('enableIntrospection'),
  plugins: pluginsList
})
